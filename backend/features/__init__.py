"""Mapa único da API: cada domínio expõe seu router e é registrado aqui."""

from __future__ import annotations

from fastapi import FastAPI

from backend.features.series.router import router as series_router


def register_routes(app: FastAPI) -> None:
    app.include_router(series_router)
