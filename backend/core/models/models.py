from __future__ import annotations

from datetime import date, datetime
from enum import StrEnum

from sqlalchemy import Enum, Index, MetaData
from sqlalchemy.orm import DeclarativeBase, Mapped, MappedAsDataclass, mapped_column

from backend.core.enum import (
    Country,
    Dataset,
    DebtHolder,
    FocusIndicator,
    FocusTargetKind,
    ImfIndicator,
    SeriesId,
)

# Toda constraint nasce com nome: é o nome que o batch do Alembic usa para recriar a
# tabela no SQLite.
NAMING_CONVENTION = {
    "ix": "ix_%(table_name)s_%(column_0_N_name)s",
    "uq": "uq_%(table_name)s_%(column_0_N_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(MappedAsDataclass, DeclarativeBase):
    """`MappedAsDataclass` faz o pyright acusar kwarg inexistente no construtor."""

    metadata = MetaData(naming_convention=NAMING_CONVENTION)


def _enum_values(enum_class: type[StrEnum]) -> list[str]:
    return [member.value for member in enum_class]


def _string_enum(enum_class: type[StrEnum], name: str) -> Enum:
    return Enum(
        enum_class,
        name=name,
        native_enum=False,
        create_constraint=False,
        validate_strings=True,
        values_callable=_enum_values,
        length=64,
    )


def _series_id_column() -> Enum:
    """Série gravada pelo valor (`"ipca_food"`), sem CHECK: uma série nova entra no
    registro sem migration, e quem grava é só o refresh, que lê o próprio registro."""
    return _string_enum(SeriesId, "series_id")


class SeriesObservation(Base):
    """Cache das séries externas. `value` está na unidade da série, como a fonte
    publica (% no mês, R$), datado no dia 1 do mês de referência."""

    __tablename__ = "observations"

    series_id: Mapped[SeriesId] = mapped_column(_series_id_column(), primary_key=True)
    ref_date: Mapped[date] = mapped_column(primary_key=True)
    value: Mapped[float]


class FetchLog(Base):
    """A última consulta à fonte de cada série. É o que limita a rede a uma consulta
    por intervalo e separa um problema de dado novo de um que já tinha sido avisado.

    `gap` diz se, depois da tentativa, ainda faltava a referência que já devia estar
    publicada.
    """

    __tablename__ = "fetch_log"

    series_id: Mapped[SeriesId] = mapped_column(_series_id_column(), primary_key=True)
    attempted_at: Mapped[datetime]
    succeeded_at: Mapped[datetime | None]
    gap: Mapped[bool]


class FederalDebtStock(Base):
    """O estoque da dívida pública federal como o Tesouro publica: uma linha por título,
    vencimento e carteira no fim de cada mês, em R$. O refresh troca a tabela inteira
    a cada arquivo novo, então ela é sempre a cópia de um único arquivo da fonte."""

    __tablename__ = "federal_debt_stock"

    stock_month: Mapped[date] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(primary_key=True)
    maturity: Mapped[date] = mapped_column(primary_key=True)
    holder: Mapped[DebtHolder] = mapped_column(
        _string_enum(DebtHolder, "debt_holder"), primary_key=True
    )
    external: Mapped[bool]
    value: Mapped[float]


class DatasetFetchLog(Base):
    """A última consulta de cada fonte que não é série, com o mesmo papel da
    `FetchLog`."""

    __tablename__ = "dataset_fetch_log"

    dataset: Mapped[Dataset] = mapped_column(
        _string_enum(Dataset, "dataset"), primary_key=True
    )
    attempted_at: Mapped[datetime]
    succeeded_at: Mapped[datetime | None]
    gap: Mapped[bool]


class FocusExpectation(Base):
    """A mediana de uma pesquisa Focus para um indicador e um período previsto, na
    unidade em que o Focus publica (% no ano, % no mês, R$/US$, US$ bilhões, % do
    PIB). Guarda uma pesquisa por semana, a do relatório: a de sexta, ou a do dia útil
    anterior quando a sexta é feriado.

    `target_period` é o mês (1 a 12), o trimestre (1 a 4) ou a reunião do Copom no ano
    (1 a 8), e 0 na previsão do ano. Na de 12 meses à frente, que anda com a pesquisa,
    ano e período são 0."""

    __tablename__ = "focus_expectations"
    __table_args__ = (Index(None, "survey_date"),)

    indicator: Mapped[FocusIndicator] = mapped_column(
        _string_enum(FocusIndicator, "focus_indicator"), primary_key=True
    )
    target_kind: Mapped[FocusTargetKind] = mapped_column(
        _string_enum(FocusTargetKind, "focus_target_kind"), primary_key=True
    )
    target_year: Mapped[int] = mapped_column(primary_key=True)
    target_period: Mapped[int] = mapped_column(primary_key=True)
    survey_date: Mapped[date] = mapped_column(primary_key=True)
    median: Mapped[float]
    respondents: Mapped[int]


class CopomMeeting(Base):
    """O calendário das reuniões do Copom: a de ordem `number` no ano, com o 1º e o 2º
    dia. A ordem é a `R<number>/<year>` da pesquisa Focus."""

    __tablename__ = "copom_meetings"

    year: Mapped[int] = mapped_column(primary_key=True)
    number: Mapped[int] = mapped_column(primary_key=True)
    first_day: Mapped[date]
    second_day: Mapped[date]


class ImfObservation(Base):
    """O valor de um indicador do FMI para um país em um ano (% do PIB ou % ao ano). Os
    anos a partir do corrente são projeção do FMI."""

    __tablename__ = "imf_observations"

    country: Mapped[Country] = mapped_column(
        _string_enum(Country, "country"), primary_key=True
    )
    indicator: Mapped[ImfIndicator] = mapped_column(
        _string_enum(ImfIndicator, "imf_indicator"), primary_key=True
    )
    year: Mapped[int] = mapped_column(primary_key=True)
    value: Mapped[float]
