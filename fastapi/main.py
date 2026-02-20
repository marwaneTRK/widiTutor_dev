from app.app import app
from config import get_settings

settings = get_settings()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=settings.api_host,
        port=settings.api_port,
        log_level=settings.log_level_lower,
        access_log=True,
        timeout_keep_alive=30
    )
