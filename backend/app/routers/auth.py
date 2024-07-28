from fastapi import APIRouter
from fastapi.logger import logger
from fastapi import Request
from fastapi.responses import JSONResponse
from docusign_esign import ApiException
from docusign_esign.client.auth import OAuth
from docusign_esign import ApiClient
from starlette.responses import RedirectResponse
from app.config.settings import settings
from app.docusign.docusign_helper import DocusignHelper

router = APIRouter()

docusign_helper = DocusignHelper()


@router.get("/dev-consent/")
async def dev_consent():
    url,scopes = DocusignHelper.get_consent_url(["Signature", "Impersonation"])
    return {
        "url" : url,
        "scopes" : scopes
    }


@router.get("/dev-generate-token/")
async def dev_generate_token():
    return {
        "token": DocusignHelper.generate_access_token(["Signature", "Impersonation"])
    }


@router.get("/callback/")
async def callback(request: Request):
    try:
        logger.info("Entered /callback endpoint")
        authorization_code = request.query_params.get("code")
        if not authorization_code:
            logger.error("No authorization code found")
            return JSONResponse(
                status_code=400,
                content={"detail": "Authorization code not found in request"},
            )

        logger.info(f"Authorization code received: {authorization_code}")

        api_client = ApiClient()
        api_client.host = settings.ds_base_path

        oauth_host_name = (
            OAuth.PRODUCTION_OAUTH_BASE_PATH
            if settings.env == "production"
            else OAuth.DEMO_OAUTH_BASE_PATH
        )
        api_client.set_oauth_host_name(oauth_host_name)

        try:
            token_response = api_client.generate_access_token(
                client_id=settings.ds_client_id,
                client_secret=settings.ds_client_secret,
                code=authorization_code,
            )

            access_token = token_response.access_token
            refresh_token = token_response.refresh_token
            new_access_token = "new_access_token_value"

            logger.info(f"Access token obtained: {access_token}")

            return {"access_token": access_token, "refresh_token": refresh_token}
        except ApiException as e:
            logger.error(f"Failed to generate access token: {e.body}")
            return JSONResponse(
                status_code=500,
                content={"detail": f"Failed to generate access token: {e.body}"},
            )

    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        return JSONResponse(
            status_code=500, content={"detail": f"An unexpected error occurred: {e}"}
        )
