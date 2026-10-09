"""Mapa único da API: cada domínio expõe seu router e é registrado aqui."""

from __future__ import annotations

from fastapi import FastAPI

from backend.features.activity.router import router as activity_router
from backend.features.credit.router import router as credit_router
from backend.features.debt.router import router as debt_router
from backend.features.deficit.router import router as deficit_router
from backend.features.economy_health.router import router as economy_health_router
from backend.features.external_sector.router import router as external_sector_router
from backend.features.focus.router import router as focus_router
from backend.features.inflation.router import router as inflation_router
from backend.features.interest.router import router as interest_router
from backend.features.overview.router import router as overview_router
from backend.features.price_cuts.router import router as price_cuts_router
from backend.features.series.router import router as series_router
from backend.features.simulator.router import router as simulator_router


def register_routes(app: FastAPI) -> None:
    app.include_router(series_router)
    app.include_router(inflation_router)
    app.include_router(price_cuts_router)
    app.include_router(external_sector_router)
    app.include_router(activity_router)
    app.include_router(credit_router)
    app.include_router(deficit_router)
    app.include_router(debt_router)
    app.include_router(simulator_router)
    app.include_router(focus_router)
    app.include_router(interest_router)
    app.include_router(overview_router)
    app.include_router(economy_health_router)
