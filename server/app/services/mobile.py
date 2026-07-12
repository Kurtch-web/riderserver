from datetime import datetime, timezone
from datetime import datetime, timezone
from secrets import choice
from string import ascii_uppercase, digits
from typing import Any

from fastapi import HTTPException

from app.core.database import get_supabase, rows
from app.models.mobile import CodeUsageCreate, LocationUpdate, MobileUserUpsert, PairingGenerateRequest, ProfileUpdate


class MobileService:
    def __init__(self):
        self.db = get_supabase()

    def find_user(self, user_id: str | None = None, email: str | None = None) -> dict[str, Any] | None:
        query = self.db.table("users").select("*")
        if user_id is not None:
            query = query.eq("id", user_id)
        if email is not None:
            query = query.eq("email", email)
        result = rows(query.limit(1).execute())
        return result[0] if result else None

    def upsert_user(self, request: MobileUserUpsert) -> dict[str, Any]:
        matches = rows(self.db.table("users").select("*").eq("device_id", request.device_id).limit(1).execute())
        existing = matches[0] if matches else None
        values = request.model_dump(by_alias=False, exclude_unset=True)
        values["device_id"] = request.device_id
        if existing:
            return rows(self.db.table("users").update(values).eq("id", existing["id"]).execute())[0]
        values.setdefault("device_name", "RIDE X")
        return rows(self.db.table("users").insert(values).execute())[0]

    def update_profile(self, user: dict[str, Any], request: ProfileUpdate) -> dict[str, Any]:
        values = request.model_dump(exclude_unset=True)
        updated = rows(self.db.table("users").update(values).eq("id", user["id"]).execute())
        return updated[0] if updated else {**user, **values}

    def generate_code(self, request: PairingGenerateRequest) -> dict[str, Any]:
        code = "".join(choice(ascii_uppercase + digits) for _ in range(6))
        values = {
            "code": code,
            "owner_user_id": request.user_id,
            "latitude": request.latitude,
            "longitude": request.longitude,
            "accuracy": request.accuracy,
            "device_name": request.device_name,
        }
        return rows(self.db.table("pairing_codes").insert(values).execute())[0]

    def get_code(self, code: str) -> dict[str, Any] | None:
        result = rows(self.db.table("pairing_codes").select("*").eq("code", code).limit(1).execute())
        return result[0] if result else None

    def update_location(self, code: str, request: LocationUpdate) -> dict[str, Any]:
        updated = rows(
            self.db.table("pairing_codes")
            .update({**request.model_dump(), "updated_at": datetime.now(timezone.utc).isoformat()})
            .eq("code", code)
            .execute()
        )
        if not updated:
            raise HTTPException(status_code=404, detail="Code not found")
        return updated[0]

    def track_usage(self, code: str, request: CodeUsageCreate) -> None:
        self.db.table("code_usage").upsert(
            {"code": code, "user_id": request.user_id, "device_id": request.device_id},
            on_conflict="code,user_id,device_id",
        ).execute()

    def code_usage(self, code: str) -> list[dict[str, Any]]:
        usage = rows(
            self.db.table("code_usage")
            .select("device_id, created_at, users(device_name)")
            .eq("code", code)
            .order("created_at")
            .execute()
        )
        return [
            {"device": item.get("users", {}).get("device_name") or item["device_id"], "used_at": item["created_at"]}
            for item in usage
        ]

    def pasted_codes(self, user_id: str) -> list[dict[str, Any]]:
        usage = rows(
            self.db.table("code_usage")
            .select("code, created_at, pairing_codes(device_name)")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return [
            {
                "code": item["code"],
                "owner_device": (item.get("pairing_codes") or {}).get("device_name") or "Unknown Device",
                "used_at": item["created_at"],
            }
            for item in usage
        ]
