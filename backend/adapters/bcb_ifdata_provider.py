from __future__ import annotations

import urllib.parse
import urllib.request
from collections.abc import Callable
from datetime import date

from pydantic import BaseModel, Field

from backend.domain.coverage import month_start, quarter_end, quarter_start
from backend.domain.series import Observation, SeriesSpec

BASE_URL = "https://olinda.bcb.gov.br/olinda/servico/IFDATA/versao/v1/odata"
# O relatório "Informações de Capital" dos conglomerados prudenciais e das instituições
# independentes: cada instituição do sistema aparece uma vez, sem dupla contagem
CAPITAL_REPORT = "5"
PRUDENTIAL_INSTITUTIONS = "1"
TIMEOUT_SECONDS = 60


class IfDataRow(BaseModel):
    institution: str = Field(alias="CodInst")
    balance: float | None = Field(alias="Saldo")


class IfDataPage(BaseModel):
    value: list[IfDataRow]


def to_total(body: bytes) -> float | None:
    """A soma da conta sobre as instituições, ou `None` quando o trimestre ainda não
    saiu. Cada instituição entra uma vez: o Olinda repete linhas idênticas em parte dos
    trimestres (o de set/2025 vem com cada linha três vezes)."""
    rows = IfDataPage.model_validate_json(body).value
    if not rows:
        return None
    balances = {row.institution: row.balance for row in rows}
    return sum(balance for balance in balances.values() if balance is not None)


def quarter_url(account: str, quarter: date) -> str:
    """O pedido de uma conta no trimestre que começa em `quarter`. O IF.data data o
    trimestre pelo último mês dele."""
    query = {
        "@AnoMes": f"{quarter_end(quarter):%Y%m}",
        "@TipoInstituicao": PRUDENTIAL_INSTITUTIONS,
        "@Relatorio": f"'{CAPITAL_REPORT}'",
        "$filter": f"Conta eq '{account}'",
        "$format": "json",
    }
    return (
        f"{BASE_URL}/IfDataValores(AnoMes=@AnoMes,TipoInstituicao=@TipoInstituicao,"
        "Relatorio=@Relatorio)?"
        + urllib.parse.urlencode(query, quote_via=urllib.parse.quote)
    )


def _download(url: str) -> bytes:
    with urllib.request.urlopen(url, timeout=TIMEOUT_SECONDS) as response:
        body: bytes = response.read()
    return body


class BcbIfDataProvider:
    name = "bcb-ifdata"

    def __init__(self, download: Callable[[str], bytes] = _download) -> None:
        self._download = download

    def get_series(self, spec: SeriesSpec, start: date, end: date) -> list[Observation]:
        """Um pedido por trimestre, porque o serviço responde um `AnoMes` por vez."""
        observations: list[Observation] = []
        quarter = quarter_start(max(start, spec.first_date))
        while quarter <= end:
            total = to_total(self._download(quarter_url(spec.code, quarter)))
            if total is not None:
                observations.append(Observation(ref_date=quarter, value=total))
            quarter = month_start(quarter, -3)
        return observations
