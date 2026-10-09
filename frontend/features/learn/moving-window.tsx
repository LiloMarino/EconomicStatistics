import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { useInflationGroups } from "@/features/inflation/use-inflation-groups";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useSeriesStatus } from "@/shared/hooks/use-series-status";
import { formatMonth, formatPercent, formatPoints, formatShortMonth } from "@/shared/lib/format";
import { addMonths, fromUrlMonth, toUrlMonth } from "@/shared/lib/months";
import { cn } from "@/shared/lib/utils";

// A régua mostra 24 meses: a janela de 12 e os 12 anteriores, de onde sai o mês. São
// também os meses que o 12 meses do fim e o do mês antes dele precisam.
const SHOWN_MONTHS = 24;
const WINDOW = 12;

/** A janela de 12 meses andando sobre o IPCA mês a mês: o mês que entra, o que sai e o
que acontece com o acumulado. O mês final mora na URL (`?janela=AAAA-MM`). */
export function MovingWindow() {
  const last = useSeriesStatus().data?.find(
    (item) => item.series_id === "ipca_general",
  )?.last_ref_date;
  if (!last) return <Skeleton className="h-56 w-full" />;
  return <Window last={last} />;
}

function Window({ last }: { last: string }) {
  const [params, setParams] = useSearchParams();
  const requested = fromUrlMonth(params.get("janela"));
  const end = requested && requested <= last ? requested : last;
  const groups = useInflationGroups({ start: addMonths(end, 1 - SHOWN_MONTHS), end });

  if (!groups.data) return <Skeleton className="h-56 w-full" />;
  const monthly = groups.data.monthly.filter((item) => item.series_id === "ipca_general");
  const rolling = groups.data.rolling_12m.filter((item) => item.series_id === "ipca_general");
  const rate = (month: string) => monthly.find((item) => item.ref_date === month)?.rate;
  const rolled = (month: string) => rolling.find((item) => item.ref_date === month)?.rate;
  const shown = Array.from({ length: SHOWN_MONTHS }, (_, index) =>
    addMonths(end, index - SHOWN_MONTHS + 1),
  );
  const leaving = addMonths(end, -WINDOW);
  const entered = rate(end);
  const left = rate(leaving);
  const now = rolled(end);
  const before = rolled(addMonths(end, -1));
  const move = (count: number) =>
    setParams(
      (next) => {
        next.set("janela", toUrlMonth(addMonths(end, count)));
        return next;
      },
      { preventScrollReset: true },
    );

  return (
    <figure className="bg-card flex flex-col gap-4 rounded-xl p-5">
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex flex-col gap-0.5">
          <strong>A janela que anda</strong>
          <span className="text-caption text-muted-foreground">
            IPCA de cada mês. Embaixo, na faixa clara, os 12 meses que entram na conta; em cima, o
            ano anterior, de onde sai o mesmo mês
          </span>
        </span>
        <span className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Mês anterior"
            disabled={end <= addMonths(last, -SHOWN_MONTHS)}
            onClick={() => move(-1)}
          >
            <ChevronLeft />
          </Button>
          <strong className="w-24 text-center tabular-nums">{formatMonth(end)}</strong>
          <Button
            variant="outline"
            size="icon"
            aria-label="Mês seguinte"
            disabled={end >= last}
            onClick={() => move(1)}
          >
            <ChevronRight />
          </Button>
        </span>
      </figcaption>

      <ol className="grid grid-cols-12 gap-1">
        {shown.map((month) => {
          const inWindow = month > leaving;
          const monthRate = rate(month);
          return (
            <li
              key={month}
              className={cn(
                "text-caption flex flex-col items-center gap-1 rounded-md px-0.5 py-2 tabular-nums",
                inWindow ? "bg-tray" : "text-muted-foreground",
                month === end && "ring-ok ring-2",
                month === leaving && "outline-trend-up outline-2 outline-dashed",
              )}
            >
              <span>{formatShortMonth(month)}</span>
              <span className="font-semibold">
                {monthRate === undefined ? "—" : formatPercent(monthRate)}
              </span>
            </li>
          );
        })}
      </ol>

      {entered !== undefined && left !== undefined && now !== undefined && before !== undefined && (
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
          <div className="flex flex-col">
            <dt className="text-caption text-muted-foreground">Entrou</dt>
            <dd className="font-semibold">
              {formatMonth(end)}: {formatPercent(entered)}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-caption text-muted-foreground">Saiu</dt>
            <dd className="font-semibold">
              {formatMonth(leaving)}: {formatPercent(left)}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-caption text-muted-foreground">12 meses</dt>
            <dd className="font-semibold">
              {formatPercent(before)} → {formatPercent(now)} ({formatPoints(now - before)})
            </dd>
          </div>
          <p className="col-span-full">
            {entered > left
              ? "O mês que entrou foi maior que o que saiu, e o 12 meses subiu."
              : entered < left
                ? "O mês que entrou foi menor que o que saiu, e o 12 meses caiu."
                : "O mês que entrou foi igual ao que saiu, e o 12 meses ficou parado."}{" "}
            Não importa se o mês novo foi alto ou baixo sozinho: o que move a linha é a troca.
          </p>
        </dl>
      )}
    </figure>
  );
}
