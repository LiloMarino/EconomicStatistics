import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import { type PeriodMode, periodModes } from "@/shared/hooks/use-month-range";
import { formatMonth, formatMonthRange, formatShortMonth } from "@/shared/lib/format";
import { addMonths } from "@/shared/lib/months";
import { cn } from "@/shared/lib/utils";
import type { components } from "@/types/openapi.generated";

type Period = components["schemas"]["PeriodDTO"];

type RangeChange = { mode: PeriodMode; start: string; end: string };

interface PeriodPickerProps {
  /** O período efetivo, que a API devolve já cortado nos meses com dado. */
  period: Period;
  mode: PeriodMode;
  onChange: (next: RangeChange) => void;
}

const modeLabels: Record<PeriodMode, string> = {
  month: "Mês",
  year: "Ano atual",
  "12m": "12 meses",
  previous: "Ano anterior",
  custom: "Personalizado",
};

/** O intervalo de cada atalho, contado a partir do último mês com dado. */
function presetRange(mode: PeriodMode, period: Period): { start: string; end: string } {
  const last = period.last_available;
  const clamp = (month: string) =>
    month < period.first_available ? period.first_available : month;
  const year = Number(last.slice(0, 4));
  switch (mode) {
    case "year":
      return { start: clamp(`${year}-01-01`), end: last };
    case "12m":
      return { start: clamp(addMonths(last, -11)), end: last };
    case "previous":
      return { start: clamp(`${year - 1}-01-01`), end: clamp(`${year - 1}-12-01`) };
    case "month":
      return { start: period.end, end: period.end };
    case "custom":
      return { start: period.start, end: period.end };
  }
}

interface MonthCalendarProps {
  period: Period;
  start: string;
  end: string;
  /** No mês, um clique escolhe; no intervalo, o primeiro clique marca o início. */
  pending: string | null;
  onPick: (month: string) => void;
}

/** Os 12 meses de um ano em grade, com setas para trocar de ano. */
function MonthCalendar({ period, start, end, pending, onPick }: MonthCalendarProps) {
  const [year, setYear] = useState(Number(end.slice(0, 4)));
  const firstYear = Number(period.first_available.slice(0, 4));
  const lastYear = Number(period.last_available.slice(0, 4));
  const from = pending ?? start;
  const to = pending ?? end;
  const months = Array.from(
    { length: 12 },
    (_, index) => `${year}-${String(index + 1).padStart(2, "0")}-01`,
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Ano anterior"
          disabled={year <= firstYear}
          onClick={() => setYear(year - 1)}
        >
          <ChevronLeft />
        </Button>
        <strong>{year}</strong>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Próximo ano"
          disabled={year >= lastYear}
          onClick={() => setYear(year + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-y-1.5">
        {months.map((month) => {
          const edge = month === from || month === to;
          const inside = month > from && month < to;
          return (
            <button
              key={month}
              type="button"
              aria-pressed={edge}
              disabled={month < period.first_available || month > period.last_available}
              onClick={() => onPick(month)}
              className={cn(
                "text-body h-11 cursor-pointer rounded-lg disabled:cursor-default disabled:opacity-40",
                edge && "bg-primary text-primary-foreground font-bold",
                inside && "bg-primary-soft rounded-none",
                !edge && !inside && "hover:bg-muted",
              )}
            >
              {formatShortMonth(month)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Os atalhos de período e, conforme o modo, o mês com setas, o intervalo escolhido em
dois cliques ou só o texto do intervalo. */
export function PeriodPicker({ period, mode, onChange }: PeriodPickerProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const label = formatMonthRange(period.start, period.end, " – ");

  function pick(month: string) {
    if (mode === "month") {
      onChange({ mode, start: month, end: month });
      setOpen(false);
    } else if (pending === null) {
      setPending(month);
    } else {
      onChange({
        mode,
        start: month < pending ? month : pending,
        end: month < pending ? pending : month,
      });
      setPending(null);
      setOpen(false);
    }
  }

  function step(count: number) {
    const month = addMonths(period.end, count);
    onChange({ mode: "month", start: month, end: month });
  }

  const calendar = (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setPending(null);
      }}
    >
      <PopoverTrigger
        render={<Button variant="outline" aria-label={`Escolher o período: ${label}`} />}
      >
        <strong className="font-semibold">{label}</strong>
        <CalendarDays />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-82 gap-3 p-4">
        <MonthCalendar
          period={period}
          start={period.start}
          end={period.end}
          pending={pending}
          onPick={pick}
        />
        <p className="text-small text-muted-foreground">
          {mode === "month"
            ? "A página inteira passa a mostrar só esse mês."
            : pending === null
              ? "Escolha o mês inicial e depois o final."
              : "Agora escolha o mês final."}
        </p>
        {mode === "custom" && (
          <div className="flex flex-wrap gap-2 border-t pt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onChange({
                  mode,
                  start: period.first_available,
                  end: period.last_available,
                });
                setOpen(false);
              }}
            >
              Tudo ({formatMonth(period.first_available)} – {formatMonth(period.last_available)})
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const start = addMonths(period.last_available, -23);
                onChange({
                  mode,
                  start: start < period.first_available ? period.first_available : start,
                  end: period.last_available,
                });
                setOpen(false);
              }}
            >
              Últimos 24 meses
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ToggleGroup
        variant="segmented"
        aria-label="Período"
        value={[mode]}
        onValueChange={([next]) => {
          const chosen = periodModes.find((key) => key === next);
          if (!chosen) return;
          onChange({ mode: chosen, ...presetRange(chosen, period) });
          setOpen(chosen === "custom");
        }}
      >
        {periodModes.map((key) => (
          <ToggleGroupItem key={key} value={key}>
            {modeLabels[key]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {mode === "month" ? (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            aria-label="Mês anterior"
            disabled={period.end <= period.first_available}
            onClick={() => step(-1)}
          >
            <ChevronLeft />
          </Button>
          {calendar}
          <Button
            variant="outline"
            size="icon"
            aria-label="Próximo mês"
            disabled={period.end >= period.last_available}
            onClick={() => step(1)}
          >
            <ChevronRight />
          </Button>
        </div>
      ) : mode === "custom" ? (
        calendar
      ) : (
        <span className="text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
