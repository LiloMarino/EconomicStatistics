from __future__ import annotations

from datetime import date, datetime
from enum import StrEnum

from sqlalchemy import Enum, MetaData
from sqlalchemy.orm import DeclarativeBase, Mapped, MappedAsDataclass, mapped_column

from backend.core.enum import SeriesId

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


def _series_id_column() -> Enum:
    """Série gravada pelo valor (`"ipca_food"`), sem CHECK: uma série nova entra no
    registro sem migration, e quem grava é só o refresh, que lê o próprio registro."""
    return Enum(
        SeriesId,
        name="series_id",
        native_enum=False,
        create_constraint=False,
        validate_strings=True,
        values_callable=_enum_values,
        length=64,
    )


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
