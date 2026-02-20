from datetime import datetime
import hmac
import hashlib

from fastapi import HTTPException, Header

from config import get_settings
from app.logging_config import logger

settings = get_settings()


def verify_internal_request(auth_header: str) -> bool:
    """Verify request comes from Express using HMAC signature"""
    try:
        if not auth_header:
            return False

        parts = auth_header.split(":")
        if len(parts) != 2:
            return False

        timestamp, signature = parts

        try:
            request_time = int(timestamp)
            current_time = int(datetime.now().timestamp())
            if abs(current_time - request_time) > settings.hmac_timestamp_window:
                logger.warning(f"Request timestamp too old: {request_time}")
                return False
        except ValueError:
            return False

        expected_signature = hmac.new(
            settings.internal_api_secret.encode(),
            timestamp.encode(),
            hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(signature, expected_signature)

    except Exception as e:
        logger.error(f"Auth verification error: {e}")
        return False


async def verify_internal_auth(x_internal_auth: str = Header(None)):
    """Dependency to verify internal authentication"""
    if not verify_internal_request(x_internal_auth):
        logger.warning("Unauthorized internal API access attempt")
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Invalid authentication"
        )
    return True
