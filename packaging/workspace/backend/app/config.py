from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    database_url: str = "postgresql://postgres:localdev@localhost:5432/tulare_chatbot"
    admin_password: str = "demo-admin"
    model_name: str = "claude-haiku-4-5-20251001"
    fallback_model_name: str = "claude-sonnet-4-5-20250929"
    embedding_dimensions: int = 384
    rag_top_k: int = 5
    max_tokens: int = 1024

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
