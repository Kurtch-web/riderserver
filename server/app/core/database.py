from functools import lru_cache
from typing import Any

from supabase import Client, create_client

from app.core.config import settings


@lru_cache
def get_supabase() -> Client:
    if not settings.SUPABASE_URL or not settings.SUPABASE_SECRET_KEY:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SECRET_KEY are required")
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SECRET_KEY)


def rows(response: Any) -> list[dict[str, Any]]:
    return list(response.data or [])
