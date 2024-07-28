from fastapi import APIRouter, Request, HTTPException, Response
from fastapi.responses import FileResponse

from docusign_esign.client.api_exception import ApiException
from app.docusign.docusign_helper import DocusignHelper
from app.config.settings import settings
import json
from starlette.responses import StreamingResponse
import io
#     try:
#         api_client = DocusignHelper.get_api_client()

#         result = api_client.call_api(
#             f"/v2.1/accounts/{settings.ds_admin_account_id}/envelopes/{envelope_id}",
#             "PUT",
#             body=dict(data),
#         )
#         return result

#     except ApiException as e:
#         raise HTTPException(status_code=e.status, detail=e.body)


router = APIRouter()
# this api is going to redirect all routes to docusign api
# url path will be appended after after accounts/{account_id}
# all get put post delete will be redirected to docusign api


@router.route("/{route:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def envelopes(request: Request):
    body = None
    if request.method != "GET":
        try:
            body = await request.json()
        except Exception as e:
            pass
    DEFAULT_SCOPE = "signature"

    try:
        api_client = DocusignHelper.get_api_client()
        try:
            access_token = DocusignHelper.generate_access_token(DEFAULT_SCOPE)
        except Exception as e:
            raise Exception(f"Error generating access token: {e}")


        qs = dict(request.query_params) if request.query_params else None
        result  =   api_client.request(
            request.method,
            f"{settings.ds_base_path}/v2.1/accounts/{settings.ds_admin_account_id}/{request.path_params['route']}",
            body=body if body else None,
            query_params=qs,
            headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
        )  
        # Create a BytesIO object from your bytes
        content_type = result.getheaders().get('Content-Type')
        if content_type == "application/pdf":
            content_type = "application/json"
            pdf_io = io.BytesIO(result.data)

            # Return as a StreamingResponse
            return StreamingResponse(pdf_io, media_type="application/pdf")

        data =  json.loads(result.data.decode("utf-8"))

        return Response(content=json.dumps(data), status_code=result.status, media_type="application/json")      
    except ApiException as e:
        res = json.loads(e.body.decode("utf-8"))
        raise HTTPException(status_code=e.status, detail=res)
