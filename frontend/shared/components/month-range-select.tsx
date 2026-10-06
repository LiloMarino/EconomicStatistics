import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import { formatMonth } from "@/shared/lib/format";
import { addMonths, monthsBetween } from "@/shared/lib/months";
import type { components } from "@/types/openapi.generated";

type Period = components["schemas"]["PeriodDTO"];

interface MonthRangeSelectProps {
  period: Period;
  onChange: (range: { start: string; end: string }) => void;
}

function presets(period: Period) {
  const last = period.last_available;
  const clamp = (month: string) =>
    month < period.first_available ? period.first_available : month;
  const year = last.slice(0, 4);
  const previousYear = String(Number(year) - 1);
  return [
    { key: "year", label: "Ano atual", start: clamp(`${year}-01-01`), end: last },
    { key: "12m", label: "12 meses", start: clamp(addMonths(last, -11)), end: last },
    {
      key: "previous",
      label: "Ano anterior",
      start: clamp(`${previousYear}-01-01`),
      end: `${previousYear}-12-01`,
    },
    { key: "all", label: "Tudo", start: period.first_available, end: last },
  ].filter((preset) => preset.end >= period.first_available);
}

function MonthSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (month: string) => void;
}) {
  const items = options.map((month) => ({ value: month, label: formatMonth(month) }));
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => {
        if (typeof next === "string") onChange(next);
      }}
    >
      <SelectTrigger size="sm" aria-label={label} className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Os atalhos de período e, ao lado, o mês de início e o de fim. O período mostrado é
o efetivo, que a API devolve já cortado nos meses com dado. */
export function MonthRangeSelect({ period, onChange }: MonthRangeSelectProps) {
  const options = presets(period);
  const active = options.find(
    (preset) => preset.start === period.start && preset.end === period.end,
  );
  const months = monthsBetween(period.first_available, period.last_available);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleGroup
        variant="segmented"
        size="sm"
        aria-label="Período"
        value={active ? [active.key] : []}
        onValueChange={([key]) => {
          const preset = options.find((option) => option.key === key);
          if (preset) onChange({ start: preset.start, end: preset.end });
        }}
      >
        {options.map((preset) => (
          <ToggleGroupItem key={preset.key} value={preset.key}>
            {preset.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="text-caption text-muted-foreground flex items-center gap-1.5">
        <MonthSelect
          label="Mês de início"
          value={period.start}
          options={months.filter((month) => month <= period.end)}
          onChange={(start) => onChange({ start, end: period.end })}
        />
        até
        <MonthSelect
          label="Mês de fim"
          value={period.end}
          options={months.filter((month) => month >= period.start)}
          onChange={(end) => onChange({ start: period.start, end })}
        />
      </div>
    </div>
  );
}
