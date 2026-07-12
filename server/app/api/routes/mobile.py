import base64
import binascii
import json
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.database import get_supabase, rows
from app.models.mobile import (
    CodeResponse,
    CodeUsageCreate,
    CodeUsageUser,
    CrashNotificationCreate,
    FcmTokenCreate,
    LocationResponse,
    LocationUpdate,
    MobileUserUpsert,
    PairingGenerateRequest,
    PastedCode,
    ProfileUpdate,
)
from app.services.mobile import MobileService

router = APIRouter()
bearer = HTTPBearer(auto_error=False)


def service() -> MobileService:
    return MobileService()


def current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)) -> dict[str, Any]:
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization required")
    try:
        token = base64.b64decode(credentials.credentials).decode()
        email = json.loads(token).get("sub")
    except (ValueError, UnicodeDecodeError, binascii.Error, json.JSONDecodeError):
        raise HTTPException(status_code=401, detail="Invalid token")
    user = service().find_user(email=email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def profile_data(user: dict[str, Any]) -> dict[str, Any]:
    return {
        key: user.get(key)
        for key in (
            "id",
            "full_name",
            "emergency_contact1_name",
            "emergency_contact1_phone",
            "emergency_contact2_name",
            "emergency_contact2_phone",
            "birthday",
            "address",
            "device_id",
            "created_at",
            "updated_at",
        )
    }


@router.get("/auth/profile")
def get_profile(user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    return profile_data(user)


@router.patch("/auth/profile")
def update_profile(request: ProfileUpdate, user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    return profile_data(service().update_profile(user, request))


@router.post("/users/get-or-create")
def get_or_create_user(request: MobileUserUpsert, _: dict[str, Any] = Depends(current_user)) -> dict[str, str]:
    user = service().upsert_user(request)
    return {"id": str(user["id"])}


@router.delete("/users/{user_id}")
def delete_user(user_id: str, user: dict[str, Any] = Depends(current_user)) -> dict[str, str]:
    if str(user["id"]) != user_id:
        raise HTTPException(status_code=403, detail="You can only delete your own profile")
    get_supabase().table("users").delete().eq("id", user_id).execute()
    return {"status": "deleted"}


@router.post("/pairing/generate", response_model=CodeResponse)
def generate_code(request: PairingGenerateRequest, user: dict[str, Any] = Depends(current_user)) -> dict[str, str]:
    if str(user["id"]) != request.user_id:
        raise HTTPException(status_code=403, detail="User does not own this pairing code")
    return service().generate_code(request)


@router.get("/pairing/location/{code}", response_model=LocationResponse)
def get_location(code: str) -> dict[str, Any]:
    pairing = service().get_code(code.upper())
    if not pairing:
        raise HTTPException(status_code=404, detail="Code not found")
    return pairing


@router.post("/pairing/update-location/{code}")
def update_location(code: str, request: LocationUpdate) -> dict[str, str]:
    service().update_location(code.upper(), request)
    return {"status": "updated"}


@router.post("/codes/{code}/track-usage")
def track_usage(code: str, request: CodeUsageCreate) -> dict[str, str]:
    service().track_usage(code.upper(), request)
    return {"status": "tracked"}


@router.get("/codes/{code}/who-used")
def code_usage(code: str) -> dict[str, list[CodeUsageUser]]:
    return {"users": service().code_usage(code.upper())}


@router.get("/users/{user_id}/pasted-codes")
def pasted_codes(user_id: str) -> dict[str, list[PastedCode]]:
    return {"codes": service().pasted_codes(user_id)}


@router.post("/users/update-fcm-token")
def update_fcm_token(request: FcmTokenCreate) -> dict[str, str]:
    get_supabase().table("device_tokens").upsert(
        {"device_id": request.device_id, "fcm_token": request.fcm_token},
        on_conflict="device_id",
    ).execute()
    return {"status": "updated"}


@router.post("/notifications/send-crash")
def send_crash_notification(
    request: CrashNotificationCreate,
    current_user: dict[str, Any] = Depends(current_user),
) -> dict[str, str]:
    if str(current_user["id"]) != request.to_user_id:
        raise HTTPException(status_code=403, detail="Crash owner does not match authenticated user")

    db = get_supabase()
    users = rows(
        db.table("users")
        .select("id, full_name, emergency_contact1_name, emergency_contact1_phone, emergency_contact2_name, emergency_contact2_phone")
        .eq("id", request.to_user_id)
        .limit(1)
        .execute()
    )
    if not users:
        raise HTTPException(status_code=404, detail="Crash owner not found")

    user = users[0]
    crash = rows(
        db.table("crash_events")
        .insert(
            {
                "user_id": str(user["id"]),
                "device_id": request.device_id,
                "device_name": request.device_name,
                "crash_time": request.crash_time.isoformat(),
                "message": request.message,
                "g_force": request.g_force,
                "accel_x": request.accel_x,
                "accel_y": request.accel_y,
                "accel_z": request.accel_z,
                "gyro_x": request.gyro_x,
                "gyro_y": request.gyro_y,
                "gyro_z": request.gyro_z,
                "temperature": request.temperature,
                "gps_latitude": request.gps_latitude,
                "gps_longitude": request.gps_longitude,
                "gps_altitude": request.gps_altitude,
                "rider_name": user.get("full_name"),
                "emergency_contact1_name": user.get("emergency_contact1_name"),
                "emergency_contact1_phone": user.get("emergency_contact1_phone"),
                "emergency_contact2_name": user.get("emergency_contact2_name"),
                "emergency_contact2_phone": user.get("emergency_contact2_phone"),
            }
        )
        .execute()
    )
    return {"status": "recorded", "crash_id": str(crash[0]["id"])}
