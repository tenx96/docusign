from pydantic import BaseModel
from typing import Optional

class Recipients(BaseModel):
    recipient_name: str
    recipient_email: str
    role_name: str
    client_user_id: Optional[str] = None
    
class EnvelopeMetadata(BaseModel):
    key: str
    value: str

class EnvelopeCreatePayloadSchema(BaseModel):
    subject: str
    message: str
    template_id: Optional[str]  
    recipients: list[Recipients]
    metadata: list[EnvelopeMetadata]


class EnvelopeUpdateSchema(BaseModel):
    emailSubject: Optional[str]
    emailBlurb: Optional[str]

class GetEnvelopeParamsSchema(BaseModel):
    from_date: Optional[str]
    empi: Optional[str]

class EnvelopeTabsParamsSchema(BaseModel):
    recipient_id: str