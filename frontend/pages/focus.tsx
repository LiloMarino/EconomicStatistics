import { CircleAlert } from "lucide-react";

import { HistoryChart } from "@/features/focus/history-chart";
import { ReportTable } from "@/features/focus/report-table";
import { SummaryCards } from "@/features/focus/summary-cards";
import { useFocusHistory, useFocusReport } from "@/features/focus/use-focus";
import { useFocusView } from "@/features/focus/use-focus-view";
import { PageHeader } from "@/shared/components/page-header";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
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

/** A previsão escolhida na URL vem do histórico, e a tabela do relatório, da última
pesquisa: cada metade da tela espera a sua consulta. */
export function FocusPage() {
  const view = useFocusView();
  const history = useFocusHistory(view.indicator, view.year);
  const report = useFocusReport();
  const years = [...new Set(report.data?.rows.map((row) => row.year))].toSorted((a, b) => a - b);
  const year = view.year ?? history.data?.year ?? years.at(0);

  return (
    <>
      <PageHeader
        title="Focus"
        description="O que o mercado espera para a economia, e como a previsão mudou semana a semana"
        controls={
          year !== undefined &&
          years.length > 0 && (
            <ToggleGroup
              variant="segmented"
              aria-label="Ano previsto"
              value={[String(year)]}
              onValueChange={([next]) => {
                if (next) view.setYear(Number(next));
              }}
            >
              {years.map((item) => (
                <ToggleGroupItem key={item} value={String(item)}>
                  {item}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )
        }
      />

      {history.error ? (
        <NoData error={history.error} />
      ) : history.isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          <SummaryCards history={history.data} />
          <HistoryChart history={history.data} />
        </>
      )}

      {report.error ? (
        <NoData error={report.error} />
      ) : report.isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <ReportTable
          report={report.data}
          year={year ?? Number(report.data.survey_date.slice(0, 4))}
          indicator={view.indicator}
          onSelect={view.setIndicator}
        />
      )}

      <footer className="text-caption text-muted-foreground border-t pt-5">
        Fonte: Banco Central, pesquisa Focus de expectativas de mercado (Sistema de Expectativas de
        Mercado, dados abertos do Olinda), mediana das previsões informadas nos últimos 30 dias;
        IPCA, meta do CMN pela série 13521 do SGS.
      </footer>
    </>
  );
}
