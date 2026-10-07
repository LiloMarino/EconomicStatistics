import { CircleAlert } from "lucide-react";

import { AccumulatedChart } from "@/features/inflation/accumulated-chart";
import { MonthlyHeatmap } from "@/features/inflation/monthly-heatmap";
import { PaceTable } from "@/features/inflation/pace-table";
import { Rolling12mChart } from "@/features/inflation/rolling-12m-chart";
import { defaultSeasonGroup } from "@/features/inflation/default-season-group";
import { SeasonalityChart } from "@/features/inflation/seasonality-chart";
import { SummaryCards } from "@/features/inflation/summary-cards";
import {
  type InflationGroups,
  useInflationGroups,
} from "@/features/inflation/use-inflation-groups";
import { useInflationPace } from "@/features/inflation/use-inflation-pace";
import { useInflationView } from "@/features/inflation/use-inflation-view";
import { useSeasonality } from "@/features/inflation/use-seasonality";
import { PageHeader } from "@/shared/components/page-header";
import { PeriodPicker } from "@/shared/components/period-picker";
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
import type { IpcaSeriesId } from "@/shared/lib/group-identity";

function Unavailable({ error }: { error: unknown }) {
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

/** As seções que dependem do ritmo e da sazonalidade, que a API calcula a partir do
último mês do período. */
function InflationSections({ data }: { data: InflationGroups }) {
  const view = useInflationView();
  const pace = useInflationPace(data.period.end);
  const seasonality = useSeasonality(Number(data.period.end.slice(0, 4)));

  function compare(seriesId: IpcaSeriesId) {
    view.setSeasonGroup(seriesId);
    document.getElementById("seasonality")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <SummaryCards data={data} pace={pace.data} />

      {/* Ritmo da inflação */}
      {pace.error ? (
        <Unavailable error={pace.error} />
      ) : pace.data ? (
        <>
          <Rolling12mChart pace={pace.data} />
          <PaceTable
            pace={pace.data}
            window={view.paceWindow}
            onWindowChange={view.setPaceWindow}
          />
        </>
      ) : (
        <Skeleton className="h-96 w-full" />
      )}

      <MonthlyHeatmap data={data} seasonality={seasonality.data} onCompare={compare} />

      {/* Sazonalidade */}
      {seasonality.error ? (
        <Unavailable error={seasonality.error} />
      ) : seasonality.data ? (
        <SeasonalityChart
          data={seasonality.data}
          seriesId={view.seasonGroup ?? defaultSeasonGroup(seasonality.data)}
          onSelect={view.setSeasonGroup}
        />
      ) : (
        <Skeleton className="h-96 w-full" />
      )}

      <AccumulatedChart data={data} selected={view.calcGroup} onSelect={view.setCalcGroup} />
    </>
  );
}

export function InflationPage() {
  const { mode, range, setRange } = useMonthRange();
  const { data, isPending, error } = useInflationGroups(range);

  return (
    <>
      <PageHeader
        title="Inflação por categoria"
        description="IPCA por grupo de gasto · IBGE, tabela 7060"
        controls={data && <PeriodPicker period={data.period} mode={mode} onChange={setRange} />}
      />

      {error ? (
        <Unavailable error={error} />
      ) : isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          <InflationSections data={data} />
          <footer className="text-caption text-muted-foreground border-t pt-5">
            Fonte: IBGE, tabela 7060 (IPCA por grupo de gasto).
          </footer>
        </>
      )}
    </>
  );
}
