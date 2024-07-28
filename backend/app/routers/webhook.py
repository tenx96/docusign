from fastapi import APIRouter

router = APIRouter()


# create a webook to recienve events for envelope and recipients

@router.post("/events")
def webhook(body: dict):
    print(body)
    return {"message": "Webhook received"}