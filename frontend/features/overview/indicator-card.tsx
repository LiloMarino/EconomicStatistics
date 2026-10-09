import { TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

import { indicatorConfig, periodFormats, valueFormats } from "@/features/overview/indicator-config";
import { Sparkline } from "@/features/overview/sparkline";
import type { Indicator } from "@/features/overview/use-overview";
import { ConceptHint } from "@/shared/components/concept-hint";
import { StatCard } from "@/shared/components/stat-card";
import { Badge } from "@/shared/components/ui/badge";
import { formatPoints, formatShortPercent, formatSignedPercent } from "@/shared/lib/format";

function formatChange({ change, change_kind }: Pick<Indicator, "change" | "change_kind">) {
  if (change === null) return null;
  return change_kind === "points" ? formatPoints(change) : formatSignedPercent(change);
}

function formatWindow(months: number) {
  return `em ${months} ${months === 1 ? "mês" : "meses"}`;
}

/** O último valor de um indicador, quanto mudou, a forma recente e a tela onde ele se
explica. */
export function IndicatorCard({ data }: { data: Indicator }) {
  const config = indicatorConfig[data.indicator];
  const unit = typeof config.unit === "function" ? config.unit(data.ref_date) : config.unit;
  const change = formatChange(data);
  const Trend = data.change !== null && data.change < 0 ? TrendingDown : TrendingUp;

  return (
    <StatCard
      label={config.title}
      hint={<ConceptHint id={config.concept} />}
      value={valueFormats[config.format](data.value)}
    >
      {unit && <span className="text-caption text-muted-foreground">{unit}</span>}
      {change !== null && data.change_months !== null && (
        <span className="text-caption text-muted-foreground flex items-center gap-1.5">
          <Trend className="size-3.5" aria-hidden="true" />
          <strong className="text-foreground font-semibold">{change}</strong>{" "}
          {formatWindow(data.change_months)}
        </span>
      )}
      {data.band && data.within_band !== null && (
        <Badge variant={data.within_band ? "ok" : "warning"} className="self-start">
          {data.within_band ? "dentro da meta" : "fora da meta"} (
          {formatShortPercent(data.band.floor)} a {formatShortPercent(data.band.ceiling)})
        </Badge>
      )}
      <Sparkline values={data.sparkline} label={`Evolução recente de ${config.title}`} />
      <div className="text-caption text-muted-foreground flex items-center justify-between gap-2 border-t pt-2">
        <span>
          até {periodFormats[config.period](data.ref_date)} · {config.source}
        </span>
        <Link to={config.to} className="text-foreground font-semibold whitespace-nowrap">
          Ver tela →
        </Link>
      </div>
    </StatCard>
  );
}
