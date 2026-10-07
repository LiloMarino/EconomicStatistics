import { CircleAlert, Check } from "lucide-react";

import { verdictLook } from "@/features/inflation/pace-verdict";
import type { InflationGroups } from "@/features/inflation/use-inflation-groups";
import type { InflationPace } from "@/features/inflation/use-inflation-pace";
import { Formula, FormulaBox } from "@/shared/components/formula";
import { GroupChip } from "@/shared/components/group-chip";
import { HintButton } from "@/shared/components/hint-button";
import { StatCard } from "@/shared/components/stat-card";
import {
  formatMonth,
  formatMonthRange,
  formatPercent,
  formatPoints,
  formatShortMonth,
} from "@/shared/lib/format";
import { isIpcaSeries } from "@/shared/lib/group-identity";
import { texDecimal } from "@/shared/lib/tex";

function TwelveMonthsCard({ pace }: { pace: InflationPace }) {
  const last = pace.general_12m.at(-1);
  if (!last) return null;
  const below = pace.ceiling !== null && last.rate <= pace.ceiling;
  return (
    <StatCard
      label="IPCA em 12 meses"
      hint={
        <HintButton label="O que é o acumulado de 12 meses">
          A inflação dos 12 meses que terminam em {formatMonth(pace.end)}. É o número que se compara
          com a meta, porque cada janela de 12 meses tem um mês de cada.
        </HintButton>
      }
      value={formatPercent(last.rate)}
    >
      {pace.ceiling !== null &&
        (below ? (
          <span className="text-caption text-ok inline-flex items-center gap-1.5 font-semibold">
            <Check className="size-4" />
            abaixo do teto da meta ({formatPercent(pace.ceiling)})
          </span>
        ) : (
          <span className="text-caption text-trend-up inline-flex items-center gap-1.5 font-semibold">
            <CircleAlert className="size-4" />
            acima do teto da meta ({formatPercent(pace.ceiling)})
          </span>
        ))}
    </StatCard>
  );
}

/** A conta do ritmo, com os números do último mês e a tabela dos 3 meses. */
function PaceExplanation({ pace }: { pace: InflationPace }) {
  const previous = pace.general_12m.at(-2);
  const current = pace.general_12m.at(-1);
  const threeBefore = pace.general_12m.at(-4);
  const lastMonth = pace.last_months.at(-1);
  if (!previous || !current || !threeBefore || !lastMonth) return null;
  const endYear = Number(pace.end.slice(0, 4));
  const label = `${formatShortMonth(pace.end)}/${String(endYear).slice(2)}`;
  const enteredBigger = lastMonth.rate > lastMonth.year_before;
  const band = formatPoints(pace.steady_band).replace("+", "");

  return (
    <>
      <p>
        É a inclinação da linha de 12 meses do gráfico abaixo. Se ela sobe, a inflação está
        acelerando; se desce, freando; se fica quase reta, estável.
      </p>
      <div className="flex flex-col gap-2">
        <strong>A conta de 1 mês</strong>
        <p className="text-muted-foreground">
          O 12 meses ganha o mês novo e perde o mesmo mês do ano passado:
        </p>
        <FormulaBox
          legend={[
            { symbol: "A_t", text: <>acumulado de 12 meses no mês t</> },
            { symbol: "m_t", text: <>inflação do mês t, em fração</> },
            { symbol: "m_{t-12}", text: <>a do mesmo mês, um ano antes</> },
          ]}
        >
          <Formula tex="1 + A_t = (1 + A_{t-1}) \times \dfrac{1 + m_t}{1 + m_{t-12}}" />
        </FormulaBox>
        <FormulaBox>
          <Formula
            flushLeft
            tex={`1 + A_{\\text{${label}}} = ${texDecimal(1 + previous.rate, 4)} \\times \\dfrac{${texDecimal(1 + lastMonth.rate, 4)}}{${texDecimal(1 + lastMonth.year_before, 4)}} = ${texDecimal(1 + current.rate, 4)}`}
          />
          <Formula
            flushLeft
            tex={`\\text{inclinação} = ${texDecimal(current.rate * 100, 2)} - ${texDecimal(previous.rate * 100, 2)} = \\mathbf{${texDecimal(pace.change_1m * 100, 2)}}\\ \\text{p.p.}`}
          />
        </FormulaBox>
        <p className="text-muted-foreground">
          Na prática: entrou {formatPercent(lastMonth.rate)} ({label}) e saiu{" "}
          {formatPercent(lastMonth.year_before)} ({formatShortMonth(pace.end)}/
          {String(endYear - 1).slice(2)}).{" "}
          {lastMonth.rate === lastMonth.year_before
            ? "Os dois são iguais, a linha ficou parada."
            : enteredBigger
              ? "Entrou maior que saiu, a linha subiu."
              : "Entrou menor que saiu, a linha desceu."}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <strong>A conta de 3 meses</strong>
        <p className="text-muted-foreground">
          É o mesmo passo três vezes: os últimos 3 meses deste ano contra os mesmos 3 do ano
          passado.
        </p>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 gap-y-1">
          <span className="text-muted-foreground">Mês</span>
          <span className="text-muted-foreground text-right">{endYear}</span>
          <span className="text-muted-foreground text-right">{endYear - 1}</span>
          <span className="text-muted-foreground text-right">Diferença</span>
          {pace.last_months.map((month) => (
            <div key={month.ref_date} className="contents">
              <span>{formatShortMonth(month.ref_date)}</span>
              <span className="text-right">{formatPercent(month.rate)}</span>
              <span className="text-right">{formatPercent(month.year_before)}</span>
              <strong className="text-right">
                {formatPoints(month.difference).replace(" p.p.", "")}
              </strong>
            </div>
          ))}
          <span className="col-span-4 border-t pt-1.5">
            Soma: {formatPoints(pace.last_months_difference)} Pela linha:{" "}
            {formatPercent(threeBefore.rate)} → {formatPercent(current.rate)} ={" "}
            <strong>{formatPoints(pace.change_3m)}</strong> A diferença entre as duas é a
            composição.
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <strong>Quando cada veredito aparece</strong>
        <span className="grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-0.5">
          <strong className="text-trend-up">Acelerando</strong>
          <span>subiu mais de {band} em 3 meses</span>
          <strong>Estável</strong>
          <span>
            entre −{band.replace(" p.p.", "")} e +{band}
          </span>
          <strong className="text-trend-down">Freando</strong>
          <span>caiu mais de {band}</span>
        </span>
        <p className="text-muted-foreground">
          Um mês só também vale, mas oscila com o efeito base: se o mês de um ano atrás foi fora da
          curva, a linha pula sem nada ter mudado hoje. Três meses diluem isso.
        </p>
      </div>
    </>
  );
}

function PaceCard({ pace }: { pace: InflationPace }) {
  const look = verdictLook[pace.verdict];
  const Icon = look.icon;
  return (
    <StatCard
      label="Ritmo da inflação"
      hint={
        <HintButton label="O que é o ritmo" wide>
          <PaceExplanation pace={pace} />
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
}

/** Os quatro números do período: o IPCA, o 12 meses contra a meta, o ritmo e o maior e
o menor grupo. */
export function SummaryCards({ data, pace }: SummaryCardsProps) {
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
        hint={
          <HintButton label="O que é o IPCA">
            <strong>IPCA</strong> é a inflação oficial: quanto subiram os preços do que as famílias
            com renda de 1 a 40 salários mínimos compram. O IBGE publica todo mês.
          </HintButton>
        }
        value={general && formatPercent(general.rate)}
      >
        <span className="text-caption text-muted-foreground">{periodLabel}</span>
      </StatCard>
      {pace ? (
        <>
          <TwelveMonthsCard pace={pace} />
          <PaceCard pace={pace} />
        </>
      ) : (
        <>
          <StatCard label="IPCA em 12 meses" />
          <StatCard label="Ritmo da inflação" />
        </>
      )}
      <StatCard label="Maior e menor alta">
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
