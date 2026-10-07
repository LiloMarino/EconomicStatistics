import { referenceConcepts, referenceLabels } from "@/features/purchasing-power/reference-labels";
import type { PurchasingPower } from "@/features/purchasing-power/use-purchasing-power";
import { ConceptHint } from "@/shared/components/concept-hint";
import { GroupChip } from "@/shared/components/group-chip";
import { StatCard } from "@/shared/components/stat-card";
import { formatMonthRange, formatPercent, formatSignedPercent } from "@/shared/lib/format";
import { isIpcaSeries } from "@/shared/lib/group-identity";

type Group = PurchasingPower["groups"][number];

function ExtremeCard({ label, group }: { label: string; group: Group | undefined }) {
  if (!group || !isIpcaSeries(group.series_id)) return <StatCard label={label} />;
  return (
    <StatCard
      label={label}
      hint={<ConceptHint id="purchasing-power" />}
      tone={group.change < 0 ? "up" : "down"}
      value={formatSignedPercent(group.change)}
    >
      <GroupChip seriesId={group.series_id} size="sm" />
    </StatCard>
  );
}

/** O reajuste usado, em quantos grupos o dinheiro compra menos e os dois extremos. */
export function SummaryCards({ data }: { data: PurchasingPower }) {
  const losses = data.groups.filter((group) => group.change < 0).length;

  return (
    <section
      aria-label="Resumo"
      className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3"
    >
      <StatCard
        label="Reajuste usado"
        hint={<ConceptHint id={referenceConcepts[data.reference]} />}
        value={formatPercent(data.reference_raise)}
      >
        <span className="text-caption text-muted-foreground">
          {referenceLabels[data.reference]}, {formatMonthRange(data.period.start, data.period.end)}
        </span>
      </StatCard>
      <StatCard
        label="Grupos onde compra menos"
        hint={<ConceptHint id="purchasing-power" />}
        tone={losses > 0 ? "up" : "default"}
        value={
          <>
            {losses}
            <span className="text-kpi-sm text-muted-foreground">de {data.groups.length}</span>
          </>
        }
      >
        <span className="text-caption text-muted-foreground">
          os preços subiram mais que o reajuste
        </span>
      </StatCard>
      <ExtremeCard label="Maior perda" group={data.groups.at(0)} />
      <ExtremeCard label="Maior ganho" group={data.groups.at(-1)} />
    </section>
  );
}
