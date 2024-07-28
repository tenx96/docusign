from fastapi import APIRouter
from docusign_esign import AccountsApi
from app.docusign.docusign_helper import DocusignHelper
from app.config.settings import settings

router = APIRouter()


# get permission profiles

@router.get("/permission_profiles", tags=["Accounts"])
async def get_permission_profiles():
    accounts_api = AccountsApi(DocusignHelper.get_api_client())

    result = accounts_api.list_permissions(settings.ds_admin_account_id)

    return result.to_dict()



