import type { Interest } from "@/features/interest/use-interest";
import { ConceptHint } from "@/shared/components/concept-hint";
import { StatCard } from "@/shared/components/stat-card";
import { formatDay, formatDays, formatPercent, formatPoints } from "@/shared/lib/format";

type Selic = Interest["selic"];
type NextMeeting = NonNullable<Interest["next_meeting"]>;

/** A meta mudou nesta última reunião: "cortada em 0,25 p.p. em 17/09/2026". */
function lastChangeSentence(change: NonNullable<Selic["last_change"]>): string {
  const difference = change.after - change.before;
  const verb = difference < 0 ? "cortada" : "subida";
  const size = formatPoints(Math.abs(difference)).replace("+", "");
  return `${verb} em ${size} em ${formatDay(change.effective_date)}`;
}

/** O que o mercado espera da próxima reunião: manter, cortar ou subir. */
function expectationSentence(meeting: NextMeeting): string {
  if (Math.abs(meeting.change) < 1e-9) {
    return `o mercado espera manter em ${formatPercent(meeting.expected)}`;
  }
  const verb = meeting.change < 0 ? "cortar" : "subir";
  const size = formatPoints(Math.abs(meeting.change)).replace("+", "");
  return `o mercado espera ${verb} ${size}, para ${formatPercent(meeting.expected)}`;
}

/** O último número de cada ponto da política de juros: a Selic de hoje, a próxima
reunião do Copom e o juro real. */
export function SummaryCards({ data }: { data: Interest }) {
  const { selic, next_meeting: meeting, real_rate: real } = data;

  return (
    <section
      aria-label="Resumo"
      className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3"
    >
      <StatCard
        label="Selic meta"
        hint={<ConceptHint id="selic" />}
        value={formatPercent(selic.current)}
      >
        <span className="text-caption text-muted-foreground">
          ao ano
          {selic.last_change && `, ${lastChangeSentence(selic.last_change)}`}
        </span>
      </StatCard>
      <StatCard
        label="Próximo Copom"
        hint={<ConceptHint id="copom" />}
        value={meeting ? formatDays(meeting.meeting.first_day, meeting.meeting.second_day) : "—"}
      >
        <span className="text-caption text-muted-foreground">
          {meeting
            ? `${meeting.meeting.number}ª reunião do ano · ${expectationSentence(meeting)}`
            : "sem reunião com data no calendário do Banco Central"}
        </span>
      </StatCard>
      <StatCard
        label="Juro real"
        hint={<ConceptHint id="real-rate" />}
        value={real ? formatPercent(real.rate) : "—"}
      >
        <span className="text-caption text-muted-foreground">
          {real
            ? `Selic descontada da inflação esperada para 12 meses (${formatPercent(real.expected_inflation)})`
            : "sem pesquisa Focus em cache"}
        </span>
      </StatCard>
    </section>
  );
}
