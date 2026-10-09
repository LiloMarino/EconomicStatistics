import { CircleAlert } from "lucide-react";

import { HistorySection } from "@/features/simulator/history-section";
import { Simulator } from "@/features/simulator/simulator";
import { useDebtCases, useDebtCountries } from "@/features/simulator/use-simulator";
import { PageHeader } from "@/shared/components/page-header";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getApiErrorMessage } from "@/shared/lib/api";

function NoData({ error }: { error: Error }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert />
        </EmptyMedia>
        <EmptyTitle>Sem dados para mostrar</EmptyTitle>
        <EmptyDescription>{getApiErrorMessage(error)}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

/** Os pontos de partida vêm das séries do Banco Central e a seção histórica, do FMI: cada
metade da tela espera a sua fonte. */
export function SimulatorPage() {
  const cases = useDebtCases();
  const countries = useDebtCountries();
  const [first, ...others] = cases.data?.cases ?? [];

  return (
    <>
      <PageHeader
        title="Simulador da dívida"
        description="Mexa em juros, crescimento e primário e veja para onde vai a dívida em 10 anos, ao lado de casos que aconteceram"
      />

      {cases.error ? (
        <NoData error={cases.error} />
      ) : cases.data && first ? (
        <Simulator cases={[first, ...others]} years={cases.data.years} />
      ) : (
        <Skeleton className="h-96 w-full" />
      )}

      {countries.error ? (
        <NoData error={countries.error} />
      ) : countries.data && cases.data ? (
        <HistorySection data={countries.data} cases={cases.data.cases} />
      ) : (
        <Skeleton className="h-96 w-full" />
      )}

      <footer className="text-caption text-muted-foreground border-t pt-5">
        Os números do seu cenário e os cenários ligados ficam no link. O simulador não prevê reação
        do mercado, juros nem câmbio. Fontes: Banco Central (dívida líquida e as contas do Brasil,
        séries do SGS 4513, 4478, 4382, 5760 e 5793) e FMI, World Economic Outlook (DataMapper):
        dívida bruta do governo geral, inflação, juros pagos e resultado primário usados nos casos
        que aconteceram.
      </footer>
    </>
  );
}
