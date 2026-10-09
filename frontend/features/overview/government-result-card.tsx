import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

import type { GovernmentResult } from "@/features/overview/use-overview";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { formatMonth, formatPercent, formatWholePercent } from "@/shared/lib/format";

interface Bar {
  label: string;
  value: number;
  color: string;
}

function bars({ primary, interest, nominal }: GovernmentResult): Bar[] {
  return [
    {
      label: primary < 0 ? "Primário (superávit)" : "Primário",
      value: primary,
      color: "bg-fiscal-primary",
    },
    { label: "+ Juros", value: interest, color: "bg-fiscal-interest" },
    { label: "= Nominal", value: nominal, color: "bg-ink-2" },
  ];
}

/** O déficit dos 12 meses, aberto no que é primário e no que é juro. */
export function GovernmentResultCard({ data }: { data: GovernmentResult }) {
  const rows = bars(data);
  const largest = Math.max(...rows.map((row) => Math.abs(row.value))) || 1;
  const deficit = data.nominal > 0;

  return (
    <ExplainedCard
      title="Resultado do governo em 12 meses"
      subtitle={`% do PIB, até ${formatMonth(data.ref_date)} · positivo é déficit`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "Como ler",
        content: (
          <>
            <TrayItem title="Primário" concept="primary-balance">
              <p>Arrecadação menos gastos, sem juros. Na convenção do BC, positivo é déficit.</p>
            </TrayItem>
            <TrayItem title="Nominal" concept="nominal-balance">
              <p>Primário mais juros: o quanto a dívida precisa crescer para fechar a conta.</p>
            </TrayItem>
          </>
        ),
      }}
    >
      <div className="flex flex-col gap-3">
        <p>
          {deficit ? "Déficit" : "Superávit"} de{" "}
          <strong>{formatPercent(Math.abs(data.nominal))} do PIB</strong>
          {deficit && data.interest_share !== null && (
            <>, e {formatWholePercent(data.interest_share)} dele é juro da dívida</>
          )}
          .
        </p>
        <div className="flex flex-col gap-2.5">
          {rows.map((row) => (
            <div
              key={row.label}
              className="text-caption grid grid-cols-[9rem_1fr_4rem] items-center gap-3"
              style={{ "--width": `${(Math.abs(row.value) / largest) * 100}%` }}
            >
              <span>{row.label}</span>
              <span className="bg-muted h-5 rounded-md">
                <span className={`block h-full w-(--width) rounded-md ${row.color}`} />
              </span>
              <strong className="text-right">{formatPercent(row.value)}</strong>
            </div>
          ))}
        </div>
        <Link to="/deficit" className="text-caption self-end font-semibold">
          Ver tela →
        </Link>
      </div>
    </ExplainedCard>
  );
}
