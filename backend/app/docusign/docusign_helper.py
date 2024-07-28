from docusign_esign import ApiClient
from docusign_esign.client.api_exception import ApiException
from app.utils.jwt_helper import get_jwt_token, get_private_key, check_jwt_expiry
from app.config.settings import settings
from app.utils.url_helper import auth_callback_url
from app.cache import RedisCache


SCOPES = ["signature"]
IMPERSONATION = ["impersonation"]

ROOMS_SCOPES = [
    "room_forms",
    "dtr.rooms.read",
    "dtr.rooms.write",
    "dtr.documents.read",
    "dtr.documents.write",
    "dtr.profile.read",
    "dtr.profile.write",
    "dtr.company.read",
    "dtr.company.write",
]

CLICK_SCOPES = ["signature", "click.manage", "click.send"]

ADMIN_SCOPES = [
    "signature",
    "organization_read",
    "group_read",
    "permission_read",
    "user_read",
    "user_write",
    "account_read",
    "domain_read",
    "identity_provider_read",
    "impersonation",
    "user_data_redact",
    "asset_group_account_read",
    "asset_group_account_clone_write",
    "asset_group_account_clone_read",
]

DEFAULT_SCOPE = "signature"

MAESTRO_SCOPES = ["signature", "aow_manage"]

WEBFORMS_SCOPES = [
    "signature",
    "webforms_read",
    "webforms_instance_read",
    "webforms_instance_write",
]


class DocusignHelper:

    @staticmethod
    def get_api_client():
        """Create api client and construct API headers"""
        api_client = ApiClient(settings.ds_base_path)
        try:
            access_token = DocusignHelper.generate_access_token(DEFAULT_SCOPE)
        except Exception as e:
            raise Exception(f"Error generating access token: {e}")
        api_client.set_default_header(
            header_name="Authorization", header_value=f"Bearer {access_token}"
        )
        return api_client

    @staticmethod
    def get_use_scopes(scopes):
        use_scopes = []
        for scope in scopes:
            if scope == "Rooms":
                use_scopes.extend(ROOMS_SCOPES)
            elif scope == "Click":
                use_scopes.extend(CLICK_SCOPES)
            elif scope == "Admin":
                use_scopes.extend(ADMIN_SCOPES)
            elif scope == "Maestro":
                use_scopes.extend(MAESTRO_SCOPES)
            elif scope == "WebForms":
                use_scopes.extend(WEBFORMS_SCOPES)
            elif scope == "Impersonation":
                use_scopes.extend(IMPERSONATION)
            else:
                use_scopes.extend(SCOPES)
        # remove duplicate scopes
        use_scopes = list(set(use_scopes))
        return use_scopes

    @staticmethod
    def generate_access_token(scopes: list[str]):
        """JSON Web Token authorization"""
        api_client = ApiClient()
        api_client.set_base_path(settings.ds_authorization_server)

        use_scopes = DocusignHelper.get_use_scopes(scopes)
        # Catch IO error
        try:
            private_key = (
                get_private_key(settings.ds_private_key_file)
                .encode("ascii")
                .decode("utf-8")
            )
        except (OSError, IOError) as err:
            raise Exception(f"JWT AUTH: Error fetching private key: {err}")
        
        cache = RedisCache()
        token = cache.get_access_token()
        
        if not token:
            token_response = get_jwt_token(
                private_key,
                use_scopes,
                settings.ds_authorization_server,
                settings.ds_client_id,
                settings.ds_impersonated_user_id,
            )
            token = token_response.access_token
            cache.save_access_token(token)

        
        return token

    def get_consent_url(api):
        try:
            consent_scopes = " ".join(DocusignHelper.get_use_scopes(api))
            redirect_uri = auth_callback_url
            consent_url = (
                f"{settings.ds_authorization_server}/oauth/auth?response_type=code&"
                f"scope={consent_scopes}&client_id={settings.ds_client_id}&redirect_uri={redirect_uri}"
            )
            return consent_url, consent_scopes
        except ApiException as err:
            raise Exception(f"Error Generating Consent Url: {err}")
