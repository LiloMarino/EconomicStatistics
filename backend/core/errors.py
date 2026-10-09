"""Erros de domínio. Este módulo é puro: o domínio roda headless nos testes e
nas conferências, então o status HTTP é um atributo da classe e a tradução
pra resposta acontece só na borda, em `backend.app`.
"""

from __future__ import annotations


class EconomicError(Exception):
    """Falha de negócio. Subclasses declaram o `status` que a borda HTTP vai ler."""

    status: int = 400


class MissingDataError(EconomicError):
    """O cache não cobre o que o pedido precisa."""

    status = 409


class InvalidRequestError(EconomicError):
    """O pedido é bem formado, mas não faz sentido para a conta."""

    status = 422
