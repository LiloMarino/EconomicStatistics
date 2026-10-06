"""Pydantic só nas bordas: request, response e resposta de fonte externa."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class BaseDTO(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid", from_attributes=True)


class ErrorResponse(BaseDTO):
    """O envelope único de erro: todo 4xx/5xx sai assim, com `detail` sempre string."""

    detail: str


ERROR_RESPONSES: dict[int | str, dict[str, type[ErrorResponse]]] = {
    422: {"model": ErrorResponse},
    500: {"model": ErrorResponse},
}
