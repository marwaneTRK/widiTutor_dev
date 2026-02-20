from app.core import app
from app.routes.public import router as public_router
from app.routes.internal import router as internal_router

app.include_router(public_router)
app.include_router(internal_router)
