from __future__ import annotations

from pathlib import Path

from pydantic import BaseModel, Field
from pydantic_settings import (
    BaseSettings,
    PydanticBaseSettingsSource,
    SettingsConfigDict,
    TomlConfigSettingsSource,
)


class ServerConfig(BaseModel):
    host: str = "127.0.0.1"
    port: int = 8000


class LoggingConfig(BaseModel):
    level: str = "INFO"


class DatabaseConfig(BaseModel):
    path: Path = Path("data/economic.db")


class Settings(BaseSettings):
    """Config do app. O `config.toml` é local e não versionado — ver config.example.toml."""

    model_config = SettingsConfigDict(
        toml_file="config.toml",
        env_prefix="ES_",
        env_nested_delimiter="__",
    )

    server: ServerConfig = Field(default_factory=ServerConfig)
    logging: LoggingConfig = Field(default_factory=LoggingConfig)
    database: DatabaseConfig = Field(default_factory=DatabaseConfig)

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        """Precedência: variável de ambiente > config.toml > default declarado acima."""
        return (env_settings, TomlConfigSettingsSource(settings_cls), init_settings)


def load_settings() -> Settings:
    return Settings()
