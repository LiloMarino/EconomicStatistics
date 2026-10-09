import { caseColor } from "@/features/simulator/identity";
import type { DebtCase } from "@/features/simulator/use-simulator";

function Fact({ label, children }: { label: string; children: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-small text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** O que a conta não mostra sobre o ponto de partida: moeda, prazo, quem empresta e o que
aconteceu de verdade. O exemplo não tem contexto. */
export function CaseContext({ base, touched }: { base: DebtCase; touched: boolean }) {
  if (!base.context) return null;
  return (
    <section
      aria-label="Ponto de partida"
      className="bg-muted border-l-6 border-(--swatch) flex flex-col gap-2.5 rounded-xl px-4 py-3.5"
      style={{ "--swatch": caseColor[base.id] }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <strong className="text-body">Ponto de partida: {base.label}</strong>
        <span className="text-small text-muted-foreground">
          {touched
            ? "Você mudou os números a partir deste caso."
            : "Seu cenário está com os números deste caso."}
        </span>
      </div>
      <dl className="text-caption grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
        <Fact label="Moeda da dívida">{base.context.currency}</Fact>
        <Fact label="Prazo">{base.context.term}</Fact>
        <Fact label="Quem empresta">{base.context.lender}</Fact>
      </dl>
      <p className="text-caption">{base.context.story}</p>
    </section>
  );
}
