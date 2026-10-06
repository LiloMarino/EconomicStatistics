import { CircleAlert } from "lucide-react";

import { AccumulatedChart } from "@/features/inflation/accumulated-chart";
import { MonthlyHeatmap } from "@/features/inflation/monthly-heatmap";
import { Rolling12mPanels } from "@/features/inflation/rolling-12m-panels";
import { useInflationGroups } from "@/features/inflation/use-inflation-groups";
import { MonthRangeSelect } from "@/shared/components/month-range-select";
import { PageHeader } from "@/shared/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useMonthRange } from "@/shared/hooks/use-month-range";
import { getApiErrorMessage } from "@/shared/lib/api";

export function InflationPage() {
  const { range, setRange } = useMonthRange();
  const { data, isPending, error } = useInflationGroups(range);

  return (
    <>
      <PageHeader
        title="Inflação por categoria"
        description="O IPCA é o índice oficial de inflação do país, medido pelo IBGE. Ele se divide em 9 grupos de gasto das famílias, e cada grupo sobe num ritmo diferente."
        actions={data && <MonthRangeSelect period={data.period} onChange={setRange} />}
      />

      {error ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CircleAlert />
            </EmptyMedia>
            <EmptyTitle>Sem dados para mostrar</EmptyTitle>
            <EmptyDescription>{getApiErrorMessage(error)}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          {/* Variação mês a mês */}
          <Card>
            <CardHeader>
              <CardTitle>Variação de cada mês</CardTitle>
              <CardDescription>
                Quanto os preços de cada grupo mudaram em cada mês. Vermelho é alta e azul é queda;
                quanto mais forte a cor, maior a mudança. Exemplo: 1,11 em Alimentação quer dizer
                que a comida ficou 1,11% mais cara naquele mês.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyHeatmap data={data} />
            </CardContent>
          </Card>

          {/* Acumulado no período */}
          <Card>
            <CardHeader>
              <CardTitle>Acumulado no período</CardTitle>
              <CardDescription>
                Quanto cada grupo subiu somando o período inteiro, com os meses compostos (1% e
                depois 2% dão 3,02%, não 3%). Barra que passa da linha tracejada subiu mais que a
                inflação média. O acumulado compõe as variações mensais publicadas com 2 casas; o
                número oficial do IBGE sai do índice sem arredondar e pode diferir em até ~0,02
                ponto percentual (2022: 5,78% aqui, 5,79% oficial).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccumulatedChart data={data} />
            </CardContent>
          </Card>

          {/* Acumulado em 12 meses */}
          <Card>
            <CardHeader>
              <CardTitle>Acumulado em 12 meses</CardTitle>
              <CardDescription>
                Em cada mês, quanto o grupo subiu nos 12 meses que terminam nele: é o número que
                aparece no noticiário como "inflação em 12 meses". Linha acima da tracejada é grupo
                subindo mais rápido que a média.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Rolling12mPanels data={data} />
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
