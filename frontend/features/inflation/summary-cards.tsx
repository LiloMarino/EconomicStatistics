import { ArrowDown, CircleAlert, Check } from "lucide-react";

import { verdictLook } from "@/features/inflation/pace-verdict";
import type { InflationGroups } from "@/features/inflation/use-inflation-groups";
import type { InflationPace } from "@/features/inflation/use-inflation-pace";
import { ConceptHint } from "@/shared/components/concept-hint";
import { GroupChip } from "@/shared/components/group-chip";
import { HintButton } from "@/shared/components/hint-button";
import { StatCard } from "@/shared/components/stat-card";
import { formatMonthRange, formatPercent, formatPoints } from "@/shared/lib/format";
import { isIpcaSeries } from "@/shared/lib/group-identity";

function TwelveMonthsCard({ pace }: { pace: InflationPace }) {
  const last = pace.general_12m.at(-1);
  if (!last) return null;
  const band = pace.band;
  return (
    <StatCard
      label="IPCA em 12 meses"
      hint={<ConceptHint id="rolling-12m" />}
      value={formatPercent(last.rate)}
    >
      {band &&
        (last.rate > band.ceiling ? (
          <span className="text-caption text-trend-up inline-flex items-center gap-1.5 font-semibold">
            <CircleAlert className="size-4" />
            acima do teto da meta ({formatPercent(band.ceiling)})
          </span>
        ) : last.rate < band.floor ? (
          <span className="text-caption text-trend-up inline-flex items-center gap-1.5 font-semibold">
            <CircleAlert className="size-4" />
            abaixo do piso da meta ({formatPercent(band.floor)})
          </span>
        ) : (
          <span className="text-caption text-ok inline-flex items-center gap-1.5 font-semibold">
            <Check className="size-4" />
            dentro da meta ({formatPercent(band.floor)} a {formatPercent(band.ceiling)})
          </span>
        ))}
    </StatCard>
  );
}

interface PaceCardProps {
  pace: InflationPace;
  onShowMath: () => void;
}

function PaceCard({ pace, onShowMath }: PaceCardProps) {
  const look = verdictLook[pace.verdict];
  const Icon = look.icon;
  const band = formatPoints(pace.steady_band).replace("+", "").replace(" p.p.", "");
  return (
    <StatCard
      label="Ritmo da inflação"
      hint={
        <HintButton
          label="O que é o ritmo"
          action={{ label: "Ver a conta no gráfico abaixo", icon: ArrowDown, onSelect: onShowMath }}
        >
          <p>
            Quanto a linha de 12 meses do gráfico abaixo subiu ou desceu nos últimos 3 meses:{" "}
            <strong>{formatPoints(pace.change_3m)}</strong>
          </p>
          <p className="text-muted-foreground">
            Desceu mais de {band} p.p.: freando. Subiu mais de {band}: acelerando. Entre os dois:
            estável.
          </p>
        </HintButton>
      }
      tone={look.tone}
      value={
        <>
          <Icon className="size-7.5" />
          {look.label}
        </>
      }
    >
      <span className="text-caption text-muted-foreground grid grid-cols-[1fr_auto] gap-x-2">
        <span>12 meses, no último mês</span>
        <strong className="text-foreground">{formatPoints(pace.change_1m)}</strong>
        <span>12 meses, em 3 meses</span>
        <strong className="text-foreground">{formatPoints(pace.change_3m)}</strong>
      </span>
    </StatCard>
  );
}

interface SummaryCardsProps {
  data: InflationGroups;
  pace: InflationPace | undefined;
  /** Abre a conta do ritmo na bandeja do gráfico de 12 meses. */
  onShowPaceMath: () => void;
}

/** Os quatro números do período: o IPCA, o 12 meses contra a meta, o ritmo e o maior e
o menor grupo. */
export function SummaryCards({ data, pace, onShowPaceMath }: SummaryCardsProps) {
  const general = data.accumulated.find((item) => item.series_id === "ipca_general");
  const groups = data.accumulated
    .filter((item) => item.series_id !== "ipca_general")
    .toSorted((a, b) => b.rate - a.rate);
  const highest = groups.at(0);
  const lowest = groups.at(-1);
  const periodLabel = formatMonthRange(data.period.start, data.period.end);

  return (
    <section
      aria-label="Resumo do período"
      className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3"
    >
      <StatCard
        label="IPCA no período"
        hint={<ConceptHint id="ipca" />}
        value={general && formatPercent(general.rate)}
      >
        <span className="text-caption text-muted-foreground">{periodLabel}</span>
      </StatCard>
      {pace ? (
        <>
          <TwelveMonthsCard pace={pace} />
          <PaceCard pace={pace} onShowMath={onShowPaceMath} />
        </>
      ) : (
        <>
          <StatCard label="IPCA em 12 meses" />
          <StatCard label="Ritmo da inflação" />
        </>
      )}
      <StatCard label="Maior e menor alta" hint={<ConceptHint id="ipca-group" />}>
        {[highest, lowest].map(
          (item) =>
            item &&
            isIpcaSeries(item.series_id) && (
              <div
                key={item.series_id}
                className="flex min-h-7.5 items-center justify-between gap-2"
              >
                <GroupChip seriesId={item.series_id} size="sm" />
                <strong className="text-lg">{formatPercent(item.rate)}</strong>
              </div>
            ),
        )}
      </StatCard>
    </section>
  );
}
