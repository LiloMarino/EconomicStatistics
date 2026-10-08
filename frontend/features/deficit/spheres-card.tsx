import { BookOpen } from "lucide-react";

import type { Deficit } from "@/features/deficit/use-deficit";
import { ChartLegend } from "@/shared/components/chart-legend";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { formatMonth, formatPercent, formatWholePercent } from "@/shared/lib/format";
import { niceTicks } from "@/shared/lib/nice-scale";
import { cn } from "@/shared/lib/utils";

type SphereDeficit = Deficit["spheres"][number];
type Point = Deficit["last"];

const sphereLabels: Record<SphereDeficit["sphere"], { label: string; members: string }> = {
  central: { label: "Governo central", members: "Tesouro, Previdência e Banco Central" },
  regional: { label: "Estados e municípios", members: "os governos regionais" },
  state_owned: { label: "Estatais", members: "sem a Petrobras e os bancos públicos" },
};

/** Os dois trechos da barra de uma esfera, empilhados como no gráfico do déficit: o que é
positivo cresce do zero para a direita, e o que é negativo, do zero para a esquerda. */
function segments({ primary, interest }: SphereDeficit) {
  const interestStart = interest >= 0 ? Math.max(primary, 0) : Math.min(primary, 0) + interest;
  return [
    { key: "primary", from: Math.min(primary, 0), to: Math.max(primary, 0) },
    { key: "interest", from: interestStart, to: interestStart + Math.abs(interest) },
  ] as const;
}

function HowToRead({ spheres, last }: { spheres: SphereDeficit[]; last: Point }) {
  const central = spheres.find((row) => row.sphere === "central");
  const total = spheres.reduce((sum, row) => sum + row.nominal, 0);
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="Governo central">
        <p>
          O governo federal: Tesouro, Previdência e o próprio Banco Central. É quem paga quase todos
          os juros, porque a dívida em títulos é dele
          {central && last.interest > 0 && (
            <>
              : em {formatMonth(last.ref_date)},{" "}
              {formatWholePercent(central.interest / last.interest)} dos juros do setor público
            </>
          )}
          .
        </p>
      </TrayItem>
      <TrayItem title="Estados e municípios">
        <p>
          Os governos regionais. Fecharam todos os anos de 2002 a 2025 com superávit primário, menos
          2014: têm limite para se endividar e devem boa parte da dívida à União.
        </p>
      </TrayItem>
      <TrayItem title="Estatais">
        <p>
          As empresas dos governos federal, estaduais e municipais. A conta do Banco Central deixa
          de fora a Petrobras e os bancos públicos, que funcionam como empresas de mercado.
        </p>
      </TrayItem>
      <TrayItem title="As três juntas" concept="nfsp">
        <p>
          Somadas, as três esferas são o déficit do setor público inteiro, o do resumo:{" "}
          {formatPercent(total)} contra {formatPercent(last.nominal)} do PIB em{" "}
          {formatMonth(last.ref_date)}. O Banco Central arredonda cada esfera para duas casas, e por
          isso a soma pode diferir do total em um centésimo.
        </p>
      </TrayItem>
    </div>
  );
}

/** Quem faz o déficit: o primário e os juros de cada esfera, em % do PIB, no último mês. */
export function SpheresCard({ spheres, last }: { spheres: SphereDeficit[]; last: Point }) {
  const all = spheres.flatMap(segments);
  const ticks = niceTicks(
    Math.min(0, ...all.map((segment) => segment.from)),
    Math.max(0, ...all.map((segment) => segment.to)),
    3,
  );
  const low = ticks.at(0) ?? 0;
  const span = (ticks.at(-1) ?? 1) - low || 1;
  const position = (value: number) => `${((value - low) / span) * 100}%`;
  const width = (value: number) => `${(value / span) * 100}%`;

  return (
    <ExplainedCard
      title="Quem faz o déficit"
      subtitle={`% do PIB em 12 meses, até ${formatMonth(last.ref_date)}, por esfera do setor público · positivo é déficit`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: <HowToRead spheres={spheres} last={last} />,
      }}
    >
      <div className="flex flex-col gap-3">
        <ChartLegend
          entries={[
            { key: "primary", label: "Primário", color: "var(--fiscal-primary)", shape: "square" },
            { key: "interest", label: "Juros", color: "var(--fiscal-interest)", shape: "square" },
          ]}
        />
        <div className="grid grid-cols-[10rem_1fr_4.5rem] items-center gap-x-4 gap-y-3">
          {spheres.map((row) => (
            <div key={row.sphere} className="contents">
              <span className="flex flex-col">
                <strong>{sphereLabels[row.sphere].label}</strong>
                <span className="text-caption text-muted-foreground">
                  {sphereLabels[row.sphere].members}
                </span>
              </span>
              <span className="relative h-6">
                {segments(row).map((segment) => (
                  <span
                    key={segment.key}
                    className={cn(
                      "absolute inset-y-0 left-(--start) w-(--width) rounded-xs",
                      segment.key === "primary" ? "bg-fiscal-primary" : "bg-fiscal-interest",
                    )}
                    style={{
                      "--start": position(segment.from),
                      "--width": width(segment.to - segment.from),
                    }}
                  />
                ))}
                <span
                  className="bg-ink-2 absolute -inset-y-1 left-(--zero) w-px"
                  style={{ "--zero": position(0) }}
                />
              </span>
              <span className="text-right font-bold tabular-nums">
                {formatPercent(row.nominal)}
              </span>
            </div>
          ))}
          <span />
          <span className="text-small text-muted-foreground relative h-5">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="absolute left-(--at) -translate-x-1/2 tabular-nums"
                style={{ "--at": position(tick) }}
              >
                {formatPercent(tick).replace(",00", "")}
              </span>
            ))}
          </span>
          <span />
        </div>
        <p className="text-caption text-muted-foreground">
          O número à direita é o nominal da esfera, o primário mais os juros. Primário abaixo de
          zero é superávit: a barra vai para a esquerda do zero e abate os juros.
        </p>
      </div>
    </ExplainedCard>
  );
}
