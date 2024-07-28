from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, templates, envelope, account, webhook, demo
from app.config.settings import settings

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(templates.router, prefix="/templates")
app.include_router(envelope.router, prefix="/envelope")
app.include_router(account.router, prefix="/account")
app.include_router(webhook.router, prefix="/webhook")
app.include_router(demo.router, prefix="/demo")


@app.get("/")
def read_root():
    return {"Hello": "World", "env": settings.env}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
