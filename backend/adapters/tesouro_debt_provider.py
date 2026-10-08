from __future__ import annotations

import csv
import io
import urllib.request
from datetime import date, datetime

from pydantic import BaseModel, Field

from backend.core.enum import DebtHolder
from backend.domain.federal_debt import DebtHolding

# O CKAN do Tesouro Transparente diz onde está o arquivo de hoje do conjunto
PACKAGE_URL = (
    "https://www.tesourotransparente.gov.br/ckan/api/3/action/package_show"
    "?id=estoque-da-divida-publica-federal"
)
TIMEOUT_SECONDS = 120

HOLDERS = {"Mercado": DebtHolder.MARKET, "Banco Central": DebtHolder.CENTRAL_BANK}


class CkanResource(BaseModel):
    format: str
    url: str


class CkanPackage(BaseModel):
    resources: list[CkanResource]


class CkanResponse(BaseModel):
    result: CkanPackage


class StockRow(BaseModel):
    """Uma linha do CSV, com o cabeçalho que o Tesouro publica. O valor vem em R$ com
    vírgula decimal e sem separador de milhar; as datas em dd/mm/aaaa e mm/aaaa."""

    title: str = Field(alias="Titulo/Contrato")
    maturity: str = Field(alias="Vencimento do Titulo/Contrato")
    value: str = Field(alias="Valor do Estoque")
    stock_month: str = Field(alias="Mes do Estoque")
    holder: str = Field(alias="Classe da Carteira")
    debt_kind: str = Field(alias="Tipo de Divida")


class TesouroDebtProvider:
    name = "tesouro-dpf"

    def get_stock(self) -> list[DebtHolding]:
        package = CkanResponse.model_validate_json(_download(PACKAGE_URL))
        csv_url = next(
            item.url for item in package.result.resources if item.format == "CSV"
        )
        return to_holdings(_download(csv_url))


def _download(url: str) -> bytes:
    with urllib.request.urlopen(url, timeout=TIMEOUT_SECONDS) as response:
        body: bytes = response.read()
    return body


def to_holdings(body: bytes) -> list[DebtHolding]:
    """O arquivo vem em UTF-8 e separado por `;`. Linha repetida (mesmo mês, título,
    vencimento e carteira) soma no valor, porque a tabela tem essa chave."""
    reader = csv.DictReader(io.StringIO(body.decode("utf-8-sig")), delimiter=";")
    merged: dict[tuple[date, str, date, DebtHolder], DebtHolding] = {}
    for raw in reader:
        row = StockRow.model_validate(raw)
        holding = DebtHolding(
            stock_month=datetime.strptime(row.stock_month, "%m/%Y").date(),
            title=row.title.strip(),
            maturity=datetime.strptime(row.maturity, "%d/%m/%Y").date(),
            holder=HOLDERS[row.holder],
            external="Externa" in row.debt_kind,
            value=float(row.value.replace(",", ".")),
        )
        key = (holding.stock_month, holding.title, holding.maturity, holding.holder)
        previous = merged.get(key)
        merged[key] = (
            holding
            if previous is None
            else DebtHolding(
                stock_month=holding.stock_month,
                title=holding.title,
                maturity=holding.maturity,
                holder=holding.holder,
                external=holding.external,
                value=previous.value + holding.value,
            )
        )
    return list(merged.values())
