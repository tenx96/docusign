from fastapi import APIRouter
from docusign_esign import TemplatesApi
from app.docusign.docusign_helper import DocusignHelper
from app.config.settings import settings
from fastapi.responses import FileResponse
router = APIRouter()


@router.get("/", tags=["Templates"])
async def get_templates():

    templates_api = TemplatesApi(DocusignHelper.get_api_client())

    result = templates_api.list_templates(settings.ds_admin_account_id)

    return result.to_dict()


@router.get("/{template_id}", tags=["Templates"])
async def get_template(template_id: str):
    templates_api = TemplatesApi(DocusignHelper.get_api_client())

    result = templates_api.get(settings.ds_admin_account_id, template_id)

    return result.to_dict()

@router.get("/{template_id}/document/{document_id}/tabs", tags=["Templates"])
async def get_data_labels(template_id: str, document_id: str):
    templates_api = TemplatesApi(DocusignHelper.get_api_client())

    result = templates_api.get_document_tabs(settings.ds_admin_account_id, document_id, template_id)

    return result.to_dict()

@router.get("/{template_id}/documents/{document_id}", tags=["Templates"])
async def get_template_document(template_id: str, document_id: str):
    templates_api = TemplatesApi(DocusignHelper.get_api_client())

    result = templates_api.get_document(settings.ds_admin_account_id,document_id,template_id)
    return FileResponse(result)


@router.get("/{template_id}/documents", tags=["Templates"])
async def get_template_documents(template_id: str):
    templates_api = TemplatesApi(DocusignHelper.get_api_client())

    result = templates_api.list_documents(settings.ds_admin_account_id, template_id)

    return result.to_dict()


@router.get("/{template_id}/recipients", tags=["Templates"])
async def get_template_recipients(template_id: str):
    templates_api = TemplatesApi(DocusignHelper.get_api_client())

    result = templates_api.list_recipients(settings.ds_admin_account_id, template_id)

    return result.to_dict()