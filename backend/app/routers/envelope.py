from fastapi import APIRouter, Request, HTTPException, Depends
from docusign_esign import (
    EnvelopesApi,
    EnvelopeDefinition,
    TemplateRole,
)
from app.models.validation.envelope import (
    EnvelopeCreatePayloadSchema,
    EnvelopeUpdateSchema,
    GetEnvelopeParamsSchema,
    EnvelopeTabsParamsSchema,
)


from docusign_esign.models import RecipientViewRequest, CustomFields, TextCustomField

from app.docusign.docusign_helper import DocusignHelper
from app.config.settings import settings
from app.utils.helper import generate_unique_client_id
from docusign_esign.client.api_exception import ApiException

router = APIRouter()


@router.get("/{envelope_id}/custom-fields", tags=["Envelope"])
async def get_custom_fields(envelope_id: str):
    """
    Retrieves the custom fields associated with the specified envelope ID.

    Parameters:
        envelope_id (str): The ID of the envelope to retrieve custom fields for.

    Returns:
        dict: Dictionary containing the custom fields associated with the envelope.

    Raises:
        HTTPException: If an error occurs during the retrieval process, an HTTPException
                       is raised with the corresponding status code and error detail.
    """

    try:
        api_client = DocusignHelper.get_api_client()
        envelopes_api = EnvelopesApi(api_client)

        account_id = settings.ds_admin_account_id
        custom_fields = envelopes_api.list_custom_fields(account_id, envelope_id)

        return custom_fields.to_dict()

    except ApiException as e:
        raise HTTPException(status_code=e.status, detail=e.body)


# update envelope


@router.put("/{envelope_id}", tags=["Envelope"])
async def update_envelope(envelope_id: str, data: EnvelopeUpdateSchema,
):
    """
    Updates the envelope based on the provided data.

    Parameters:
        envelope_id (str): The ID of the envelope to update.
        data (dict): Data containing information about the envelope to be updated,
                     including recipient details, subject, message, template ID,
                     and role name.

    Returns:
        dict: Dictionary containing the envelope ID upon successful update.

    Raises:
        HTTPException: If an error occurs during the update process, an HTTPException
                       is raised with the corresponding status code and error detail.
    """

    try:
        api_client = DocusignHelper.get_api_client()

        result = api_client.call_api(
            f"/v2.1/accounts/{settings.ds_admin_account_id}/envelopes/{envelope_id}",
            "PUT",
            body=dict(data),
        )
        return result

    except ApiException as e:
        raise HTTPException(status_code=e.status, detail=e.body)


@router.post("/create", tags=["Envelope"])
async def create_new_envelope(data: EnvelopeCreatePayloadSchema, request: Request):
    """
    Creates a new envelope based on the provided data.

    Parameters:
        data (dict): Data containing information about the envelope to be created,
                     including recipient details, subject, message, template ID,
                     and role name.

    Returns:
        dict: Dictionary containing the envelope ID upon successful creation.

    Raises:
        HTTPException: If an error occurs during the creation process, an HTTPException
                       is raised with the corresponding status code and error detail.
    """

    try:

        api_client = DocusignHelper.get_api_client()
        envelopes_api = EnvelopesApi(api_client)

        envelope_definition = EnvelopeDefinition(
            email_subject=data.subject,
            email_blurb=data.message,
            template_id=data.template_id,
        )

        textCustomFields = [
            TextCustomField(name=meta.key, value=meta.value) for meta in data.metadata
        ]

        envelope_definition.custom_fields = CustomFields(
            text_custom_fields=textCustomFields
        )

        template_role = [
            TemplateRole(
                email=item.recipient_email,
                name=item.recipient_name,
                role_name=item.role_name,
                client_user_id=item.client_user_id,
            )
            for item in data.recipients
        ]

        envelope_definition.template_roles = template_role
        envelope_definition.status = "sent"

        account_id = settings.ds_admin_account_id
        envelope_summary = envelopes_api.create_envelope(
            account_id,
            envelope_definition=envelope_definition,
        )

        return {"envelope_id": envelope_summary.envelope_id}

    except ApiException as e:
        raise HTTPException(status_code=e.status, detail=e.body)


@router.get("/list", tags=["Envelope"])
async def list_envelopes(request: Request, params: GetEnvelopeParamsSchema = Depends()):
    """
    Lists all envelopes associated with the account.

    Returns:
        dict: Dictionary containing the list of envelopes associated with the account.

    Raises:
        HTTPException: If an error occurs during the listing process, an HTTPException
                       is raised with the corresponding status code and error detail.
    """

    try:
        params_dict = {"from_date": params.from_date}
        params_dict["custom_field"] = f"empi={params.empi}"
        api_client = DocusignHelper.get_api_client()
        envelopes_api = EnvelopesApi(api_client)

        account_id = settings.ds_admin_account_id
        envelopes = envelopes_api.list_status_changes(account_id, **params_dict)

        return envelopes.to_dict()

    except ApiException as e:
        raise HTTPException(status_code=e.status, detail=e.body)


@router.get("/{envelope_id}", tags=["Envelope"])
async def get_envelope(envelope_id: str):
    """
    Retrieves the envelope details for the specified envelope ID.

    Parameters:
        envelope_id (str): The ID of the envelope to retrieve.

    Returns:
        dict: Dictionary containing the envelope details.

    Raises:
        HTTPException: If an error occurs during the retrieval process, an HTTPException
                       is raised with the corresponding status code and error detail.
    """

    try:
        api_client = DocusignHelper.get_api_client()
        envelopes_api = EnvelopesApi(api_client)

        account_id = settings.ds_admin_account_id
        envelope = envelopes_api.get_envelope(account_id, envelope_id)

        return envelope.to_dict()

    except ApiException as e:
        raise HTTPException(status_code=e.status, detail=e.body)


@router.get("/{envelope_id}/recipients", tags=["Envelope"])
async def get_envelope_recipients(envelope_id: str):
    """
    Retrieves the recipients associated with the specified envelope ID.

    Parameters:
        envelope_id (str): The ID of the envelope to retrieve recipients for.

    Returns:
        dict: Dictionary containing the recipients associated with the envelope.

    Raises:
        HTTPException: If an error occurs during the retrieval process, an HTTPException
                       is raised with the corresponding status code and error detail.
    """

    try:
        api_client = DocusignHelper.get_api_client()
        envelopes_api = EnvelopesApi(api_client)

        account_id = settings.ds_admin_account_id
        recipients = envelopes_api.list_recipients(account_id, envelope_id)

        return recipients.to_dict()

    except ApiException as e:
        raise HTTPException(status_code=e.status, detail=e.body)


@router.get("/{envelope_id}/documents", tags=["Envelope"])
async def get_envelope_documents(envelope_id: str):
    """
    Retrieves the documents associated with the specified envelope ID.

    Parameters:
        envelope_id (str): The ID of the envelope to retrieve documents for.

    Returns:
        dict: Dictionary containing the documents associated with the envelope.

    Raises:
        HTTPException: If an error occurs during the retrieval process, an HTTPException
                       is raised with the corresponding status code and error detail.
    """

    try:
        api_client = DocusignHelper.get_api_client()
        envelopes_api = EnvelopesApi(api_client)

        account_id = settings.ds_admin_account_id
        documents = envelopes_api.list_documents(account_id, envelope_id)

        return documents.to_dict()

    except ApiException as e:
        raise HTTPException(status_code=e.status, detail=e.body)


@router.get("/{envelope_id}/tabs", tags=["Envelope"])
async def get_envelope_tabs(
    envelope_id: str, params: EnvelopeTabsParamsSchema = Depends()
):
    """
    Retrieves the tabs associated with the specified envelope ID.

    Parameters:
        envelope_id (str): The ID of the envelope to retrieve tabs for.

    Returns:
        dict: Dictionary containing the tabs associated with the envelope.

    Raises:
        HTTPException: If an error occurs during the retrieval process, an HTTPException
                       is raised with the corresponding status code and error detail.
    """

    try:
        api_client = DocusignHelper.get_api_client()
        envelopes_api = EnvelopesApi(api_client)

        account_id = settings.ds_admin_account_id
        tabs = envelopes_api.list_tabs(account_id, envelope_id, **dict(params))

        return tabs.to_dict()

    except ApiException as e:
        raise HTTPException(status_code=e.status, detail=e.body)


@router.get("/{envelope_id}/recipients/{recipient_id}/tabs", tags=["Envelope"])
async def get_recipient_tabs(envelope_id: str, recipient_id: str):
    """
    Retrieves the tabs associated with the specified recipient ID for the given envelope ID.

    Parameters:
        envelope_id (str): The ID of the envelope.
        recipient_id (str): The ID of the recipient.

    Returns:
        dict: Dictionary containing the tabs associated with the recipient.

    Raises:
        HTTPException: If an error occurs during the retrieval process, an HTTPException
                       is raised with the corresponding status code and error detail.
    """

    try:
        api_client = DocusignHelper.get_api_client()
        envelopes_api = EnvelopesApi(api_client)

        account_id = settings.ds_admin_account_id
        tabs = envelopes_api.list_tabs(account_id, envelope_id, recipient_id)

        return tabs.to_dict()

    except ApiException as e:
        raise HTTPException(status_code=e.status, detail=e.body)


# create recipient view
@router.get("/{envelope_id}/recipient_view", tags=["Envelope"])
async def create_recipient_view(
    envelope_id: str, request: Request, email: str = "", name : str = "",client_user_id: str= "", redirect_url: str = ""
):
    """
    Creates a recipient view for the specified envelope ID.

    Parameters:
        envelope_id (str): The ID of the envelope to create the recipient view for.

    Returns:
        dict: Dictionary containing the URL for the recipient view.

    Raises:
        HTTPException: If an error occurs during the creation process, an HTTPException
                       is raised with the corresponding status code and error detail.
    """
    try:
        api_client = DocusignHelper.get_api_client()
        envelopes_api = EnvelopesApi(api_client)

        account_id = settings.ds_admin_account_id

        view_request = RecipientViewRequest(
            client_user_id=client_user_id,
            authentication_method="email",
            return_url=redirect_url,
            user_name=name,
            email=email,
        )

        view_url = envelopes_api.create_recipient_view(
            account_id, envelope_id, recipient_view_request=view_request
        )

        return {"url": view_url.url}

    except ApiException as e:
        raise HTTPException(status_code=e.status, detail=e.body)


# create document tabs
@router.post("/{envelope_id}/document/{document_id}/tabs", tags=["Envelope"])
async def create_document_tabs(envelope_id: str, document_id: str, request: Request):
    """
    Creates tabs for the specified document ID within the given envelope ID.

    Parameters:
        envelope_id (str): The ID of the envelope containing the document.
        document_id (str): The ID of the document to create tabs for.

    Returns:
        dict: Dictionary containing the tab details upon successful creation.

    Raises:
        HTTPException: If an error occurs during the creation process, an HTTPException
                       is raised with the corresponding status code and error detail.
    """

    try:
        api_client = DocusignHelper.get_api_client()
        envelopes_api = EnvelopesApi(api_client)

        account_id = settings.ds_admin_account_id
        tabs = envelopes_api.create_document_tabs(
            account_id,
            document_id,
            envelope_id,
            {
                "prefillTabs": {
                    "textTabs": [{"tabLabel": "Address", "value": "123 Main St."}]
                }
            },
        )

        return tabs.to_dict()

    except ApiException as e:
        raise HTTPException(status_code=e.status, detail=e.body)


# delete envelope recipient
@router.delete("/{envelope_id}/recipient/{recipient_id}", tags=["Envelope"])
def delete_envelope_recipient(envelope_id: str, recipient_id: str):
    """
    Deletes the recipient associated with the specified recipient ID for the given envelope ID.

    Parameters:
        envelope_id (str): The ID of the envelope.
        recipient_id (str): The ID of the recipient to delete.

    Returns:
        dict: Dictionary containing the status of the deletion process.

    Raises:
        HTTPException: If an error occurs during the deletion process, an HTTPException
                       is raised with the corresponding status code and error detail.
    """

    try:
        api_client = DocusignHelper.get_api_client()
        envelopes_api = EnvelopesApi(api_client)

        account_id = settings.ds_admin_account_id
        response = envelopes_api.delete_recipient(account_id, envelope_id, recipient_id)

        return response.to_dict()

    except ApiException as e:
        raise HTTPException(status_code=e.status, detail=e.body)