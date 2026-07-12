from fastapi import APIRouter, Depends, HTTPException

from app.api.routes.auth import get_current_user
from app.core.database import get_supabase, rows
from app.models.auth import UserResponse

router = APIRouter()


def require_admin(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Administrator access required")
    return current_user


@router.get("/")
def list_crashes(_: UserResponse = Depends(require_admin), limit: int = 50) -> list[dict]:
    safe_limit = max(1, min(limit, 100))
    return rows(
        get_supabase()
        .table("crash_events")
        .select("*")
        .order("crash_time", desc=True)
        .limit(safe_limit)
        .execute()
    )


@router.get("/{crash_id}")
def get_crash(crash_id: str, _: UserResponse = Depends(require_admin)) -> dict:
    crashes = rows(
        get_supabase()
        .table("crash_events")
        .select("*")
        .eq("id", crash_id)
        .limit(1)
        .execute()
    )
    if not crashes:
        raise HTTPException(status_code=404, detail="Crash event not found")
    return crashes[0]
