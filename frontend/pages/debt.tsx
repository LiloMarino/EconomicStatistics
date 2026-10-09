import { CompositionCard } from "@/features/debt/composition-card";
import { LevelsChart } from "@/features/debt/levels-chart";
import { MaturitiesCard } from "@/features/debt/maturities-card";
import { RatesChart } from "@/features/debt/rates-chart";
import { StabilizationCard } from "@/features/debt/stabilization-card";
import { SummaryCards } from "@/features/debt/summary-cards";
import { useDebt, useFederalDebt } from "@/features/debt/use-debt";
import { NoData } from "@/shared/components/no-data";
import { PageHeader } from "@/shared/components/page-header";
import { Skeleton } from "@/shared/components/ui/skeleton";

/** A dinâmica da dívida sai das séries do Banco Central e a composição, do arquivo do
Tesouro: cada metade da tela espera a sua fonte. */
export function DebtPage() {
  const debt = useDebt();
  const federal = useFederalDebt();

  return (
    <>
      <PageHeader
        title="Dívida"
        description="Quanto o setor público deve, se a dívida está sob controle e de que ela é feita"
      />

      {debt.error ? (
        <NoData error={debt.error} />
      ) : debt.isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          <SummaryCards data={debt.data} />
          <LevelsChart levels={debt.data.levels} forecast={debt.data.levels_forecast} />
          <StabilizationCard data={debt.data.stabilization} />
          <RatesChart rates={debt.data.rates} />
        </>
      )}

      {federal.error ? (
        <NoData error={federal.error} />
      ) : federal.isPending ? (
        <Skeleton className="h-72 w-full" />
      ) : (
        <>
          <MaturitiesCard data={federal.data} />
          <CompositionCard data={federal.data} />
        </>
      )}

      <footer className="text-caption text-muted-foreground border-t pt-5">
        Fontes: Banco Central, séries do SGS 4513 e 4478 (dívida líquida do setor público, em % do
        PIB e em reais), 13762 (dívida bruta do governo geral), 4382 (PIB de 12 meses em reais),
        5760 e 5793 (juros nominais e resultado primário) e 10618 (prazo médio da dívida mobiliária
        federal); Tesouro Nacional, estoque da dívida pública federal no Tesouro Transparente; a
        previsão vem da pesquisa Focus.
      </footer>
    </>
  );
}
