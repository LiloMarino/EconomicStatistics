import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { useInflationGroups } from "@/features/inflation/use-inflation-groups";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useSeriesStatus } from "@/shared/hooks/use-series-status";
import { formatMonth, formatPercent, formatPoints, formatShortMonth } from "@/shared/lib/format";
import { addMonths, fromUrlMonth, toUrlMonth } from "@/shared/lib/months";
import { cn } from "@/shared/lib/utils";

// A régua mostra 15 meses: o mês antigo, fora das duas janelas; o mês que sai; os 11 que
// as duas janelas têm em comum; o mês que entra; e o próximo, que ainda não conta
const WINDOW = 12;
const BEFORE = WINDOW + 1;

/** A janela de 12 meses andando sobre o IPCA mês a mês: o mês que sai, o que entra e o
que acontece com o acumulado. O mês final mora na URL (`?janela=AAAA-MM`). */
export function MovingWindow() {
  const last = useSeriesStatus().data?.find(
    (item) => item.series_id === "ipca_general",
  )?.last_ref_date;
  if (!last) return <Skeleton className="h-56 w-full" />;
  return <Window last={last} />;
}

type Role = "old" | "left" | "common" | "entered" | "next";

const roleClass: Record<Role, string> = {
  old: "text-muted-foreground",
  left: "bg-tray outline-trend-up outline-2 outline-dashed",
  common: "bg-tray",
  entered: "bg-tray ring-ok ring-2",
  next: "text-muted-foreground",
};

function Window({ last }: { last: string }) {
  const [params, setParams] = useSearchParams();
  const requested = fromUrlMonth(params.get("janela"));
  const end = requested && requested <= last ? requested : last;
  const next = addMonths(end, 1);
  const groups = useInflationGroups({
    start: addMonths(end, -BEFORE),
    end: next <= last ? next : end,
  });

  if (!groups.data) return <Skeleton className="h-56 w-full" />;
  const monthly = groups.data.monthly.filter((item) => item.series_id === "ipca_general");
  const rolling = groups.data.rolling_12m.filter((item) => item.series_id === "ipca_general");
  const rate = (month: string) => monthly.find((item) => item.ref_date === month)?.rate;
  const rolled = (month: string) => rolling.find((item) => item.ref_date === month)?.rate;
  const leaving = addMonths(end, -WINDOW);
  const cells = Array.from({ length: BEFORE + 2 }, (_, index) => {
    const month = addMonths(end, index - BEFORE);
    const role: Role =
      index === 0
        ? "old"
        : month === leaving
          ? "left"
          : month === end
            ? "entered"
            : month > end
              ? "next"
              : "common";
    return { month, role };
  });
  const entered = rate(end);
  const left = rate(leaving);
  const now = rolled(end);
  const before = rolled(addMonths(end, -1));
  const move = (count: number) =>
    setParams(
      (nextParams) => {
        nextParams.set("janela", toUrlMonth(addMonths(end, count)));
        return nextParams;
      },
      { preventScrollReset: true },
    );

  return (
    <figure className="bg-card flex flex-col gap-4 rounded-xl p-5">
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex flex-col gap-0.5">
          <strong>A janela que anda</strong>
          <span className="text-caption text-muted-foreground">
            IPCA de cada mês, em %. Na troca de mês, sai o tracejado e entra o contornado; os 11 do
            meio contam nas duas janelas.
          </span>
        </span>
        <span className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Mês anterior"
            disabled={end <= addMonths(last, -60)}
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

      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-15 gap-1">
          {/* A janela anterior: do mês que sai ao mês antes do que entra */}
          <span className="text-caption text-muted-foreground col-start-2 col-end-14 flex items-center gap-2">
            <span className="border-trend-up h-2 flex-1 rounded-t border-x-2 border-t-2 border-dashed" />
            janela até {formatMonth(addMonths(end, -1))}
            {before !== undefined && (
              <strong className="text-foreground">{formatPercent(before)}</strong>
            )}
            <span className="border-trend-up h-2 flex-1 rounded-t border-x-2 border-t-2 border-dashed" />
          </span>
        </div>
        <div className="grid grid-cols-15 gap-1">
          {cells.map(({ month, role }) => {
            const value = rate(month);
            return (
              <span
                key={month}
                className={cn(
                  "text-caption flex flex-col items-center gap-1 rounded-md px-0.5 py-2 tabular-nums",
                  roleClass[role],
                )}
              >
                <span>{formatShortMonth(month)}</span>
                <span className="font-semibold">
                  {value === undefined ? "—" : formatPercent(value).replace("%", "")}
                </span>
              </span>
            );
          })}
        </div>
        <div className="grid grid-cols-15 gap-1">
          {/* A janela nova: do mês seguinte ao que saiu até o que entrou */}
          <span className="text-caption text-muted-foreground col-start-3 col-end-15 flex items-center gap-2">
            <span className="border-ok h-2 flex-1 rounded-b border-x-2 border-b-2" />
            janela até {formatMonth(end)}
            {now !== undefined && <strong className="text-foreground">{formatPercent(now)}</strong>}
            <span className="border-ok h-2 flex-1 rounded-b border-x-2 border-b-2" />
          </span>
        </div>
      </div>

      {entered !== undefined && left !== undefined && now !== undefined && before !== undefined && (
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
          <div className="flex flex-col">
            <dt className="text-caption text-muted-foreground">Saiu</dt>
            <dd className="font-semibold">
              {formatMonth(leaving)}: {formatPercent(left)}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-caption text-muted-foreground">Entrou</dt>
            <dd className="font-semibold">
              {formatMonth(end)}: {formatPercent(entered)}
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
