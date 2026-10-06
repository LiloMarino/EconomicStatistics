"""Mapa único da API: cada domínio expõe seu router e é registrado aqui."""

from __future__ import annotations

from fastapi import FastAPI


def register_routes(app: FastAPI) -> None:
    """Inclui os routers de cada feature."""
