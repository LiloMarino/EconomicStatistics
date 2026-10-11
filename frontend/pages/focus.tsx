import { focusIndicatorLabels, isFocusIndicator } from "@/features/focus/focus-labels";
import { HistoryChart } from "@/features/focus/history-chart";
import { ReportTable } from "@/features/focus/report-table";
import { SummaryCards } from "@/features/focus/summary-cards";
import { useFocusHistory, useFocusReport } from "@/features/focus/use-focus";
import { useFocusView } from "@/features/focus/use-focus-view";
import { NoData } from "@/shared/components/no-data";
import { PageHeader } from "@/shared/components/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";

/** A previsão escolhida na URL vem do histórico, e a tabela do relatório, da última
pesquisa: cada metade da tela espera a sua consulta. */
export function FocusPage() {
  const view = useFocusView();
  const history = useFocusHistory(view.indicator, view.year);
  const report = useFocusReport();
  const years = [...new Set(report.data?.rows.map((row) => row.year))].toSorted((a, b) => a - b);
  const year = view.year ?? history.data?.year ?? years.at(0);
  const indicators = [
    ...new Set(report.data?.rows.filter((row) => row.year === year).map((row) => row.indicator)),
  ];

  // Indicador e ano ficam no cabeçalho do gráfico que eles mudam, e não um no topo da
  // tela e o outro na tabela lá embaixo
  const controls = (
    <div className="flex flex-wrap items-center gap-2">
      {indicators.length > 0 && (
        <Select
          value={view.indicator}
          onValueChange={(next) => {
            if (typeof next === "string" && isFocusIndicator(next)) view.setIndicator(next);
          }}
        >
          <SelectTrigger size="sm" aria-label="Indicador">
            <SelectValue>
              {(value: string) => (isFocusIndicator(value) ? focusIndicatorLabels[value] : value)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {indicators.map((item) => (
              <SelectItem key={item} value={item}>
                {focusIndicatorLabels[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {year !== undefined && years.length > 0 && (
        <ToggleGroup
          variant="segmented"
          size="sm"
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
      )}
    </div>
  );

  return (
    <>
      <PageHeader
        title="Focus"
        description="O que o mercado espera para a economia, e como a previsão mudou semana a semana"
      />

      {history.error ? (
        <NoData error={history.error} />
      ) : history.isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          <SummaryCards history={history.data} />
          <HistoryChart history={history.data} controls={controls} />
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
