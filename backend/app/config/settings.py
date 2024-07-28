from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    env: str
    application_url: str
    ds_base_path: str
    ds_admin_account_id: str
    ds_authorization_server: str
    ds_client_id: str
    ds_client_secret: str
    ds_impersonated_user_id: str
    ds_private_key_file: str
    ds_callback_url: str

    class Config:
        env_file = ".env"


settings = Settings()
