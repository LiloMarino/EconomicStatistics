"""Mapa único da API: cada domínio expõe seu router e é registrado aqui."""

from __future__ import annotations

from fastapi import FastAPI

from backend.features.activity.router import router as activity_router
from backend.features.credit.router import router as credit_router
from backend.features.debt.router import router as debt_router
from backend.features.deficit.router import router as deficit_router
from backend.features.external_sector.router import router as external_sector_router
from backend.features.focus.router import router as focus_router
from backend.features.inflation.router import router as inflation_router
from backend.features.interest.router import router as interest_router
from backend.features.series.router import router as series_router


def register_routes(app: FastAPI) -> None:
    app.include_router(series_router)
    app.include_router(inflation_router)
    app.include_router(external_sector_router)
    app.include_router(activity_router)
    app.include_router(credit_router)
    app.include_router(deficit_router)
    app.include_router(debt_router)
    app.include_router(focus_router)
    app.include_router(interest_router)
