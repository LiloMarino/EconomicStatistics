import { InflationSignalCard } from "@/features/economy-health/inflation-signal-card";
import { PrimarySignalCard } from "@/features/economy-health/primary-signal-card";
import { ReferenceTable } from "@/features/economy-health/reference-table";
import { useEconomyHealth } from "@/features/economy-health/use-economy-health";
import { NoData } from "@/shared/components/no-data";
import { PageHeader } from "@/shared/components/page-header";
import { Skeleton } from "@/shared/components/ui/skeleton";

/** Os sinais que costumam piorar antes de uma crise: cor só onde existe faixa oficial, e o
número com a referência escrita no resto. */
export function EconomyHealthPage() {
  const health = useEconomyHealth();

  return (
    <>
      <PageHeader
        title="Saúde da economia"
        description="Os sinais que costumam piorar antes de uma crise. Só ganha cor o que tem faixa oficial; o resto mostra o número e a referência, para o semáforo não virar opinião."
      />

      {health.error ? (
        <NoData error={health.error} />
      ) : health.isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          <section aria-labelledby="with-band" className="flex flex-col gap-3.5">
            <h2 id="with-band" className="font-heading text-section-title">
              Com faixa oficial
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-3">
              <InflationSignalCard data={health.data.inflation} />
              <PrimarySignalCard data={health.data.primary} />
            </div>
          </section>

          <section aria-labelledby="without-band" className="flex flex-col gap-3.5">
            <h2 id="without-band" className="font-heading text-section-title">
              Sem faixa oficial: o número e a referência
            </h2>
            <ReferenceTable data={health.data.references} />
          </section>
        </>
      )}

      <footer className="text-caption text-muted-foreground border-t pt-5">
        Cada sinal liga ao conceito em Aprender. Fontes: IBGE (IPCA e PNAD Contínua) e Banco Central
        (SGS, pesquisa Focus e estatísticas fiscais); as referências escritas citam a fonte e a data
        de cada uma.
      </footer>
    </>
  );
}
