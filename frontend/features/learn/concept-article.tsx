import { type ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Rolling12mTargetChart } from "@/features/learn/rolling-12m-target-chart";
import { SourceList } from "@/features/learn/source-list";
import { Formula, FormulaBox } from "@/shared/components/formula";
import { Button } from "@/shared/components/ui/button";
import { type ConceptId, topicLabels } from "@/shared/concepts/concept";
import { concepts } from "@/shared/concepts/concepts";

/** O gráfico com o dado de hoje que acompanha o "É bom ou ruim?" de um conceito com
série: o texto diz a regra, o gráfico mostra onde o número está agora. */
const readingCharts: Partial<Record<ConceptId, ReactNode>> = {
  "rolling-12m": <Rolling12mTargetChart />,
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-section-title">{title}</h2>
      {children}
    </section>
  );
}

/** Os fatos do conceito ao lado do texto: de quanto em quanto tempo o dado sai e em que
telas ele aparece. */
function ConceptAside({ id }: { id: ConceptId }) {
  const { frequency, screens } = concepts[id];
  return (
    <aside
      aria-label="Resumo do conceito"
      className="bg-card text-caption flex flex-col gap-4 rounded-xl p-5"
    >
      {frequency && (
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Frequência</span>
          <strong>{frequency}</strong>
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <span className="text-muted-foreground">No app</span>
        {screens.map((screen) => (
          <Link key={screen.to} to={screen.to} className="font-semibold">
            {screen.label} →
          </Link>
        ))}
      </div>
    </aside>
  );
}

/** A página de um conceito: o que mede, a fórmula, a conta com números reais, como ler,
os cuidados e os relacionados. */
export function ConceptArticle({ id }: { id: ConceptId }) {
  const concept = concepts[id];
  const { hash } = useLocation();

  // A busca pode levar a um bloco da página, como o de um grupo do IPCA
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [hash, id]);

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
      <article className="flex min-w-0 flex-col gap-9">
        {/* Cabeçalho */}
        <header className="flex flex-col gap-3">
          <nav aria-label="Trilha" className="text-caption text-muted-foreground">
            <Link to="/learn">Aprender</Link> <span aria-hidden="true">›</span>{" "}
            {topicLabels[concept.topic]}
          </nav>
          <h1 className="font-heading text-page-title">{concept.title}</h1>
          <p className="text-muted-foreground max-w-prose text-lg">{concept.lead}</p>
        </header>

        <Section title="O que mede">
          <div className="flex max-w-prose flex-col gap-3">{concept.measures}</div>
        </Section>

        {concept.details && (
          <Section title={concept.details.title}>{concept.details.content}</Section>
        )}

        {concept.formula && (
          <Section title="A fórmula">
            <FormulaBox legend={concept.formula.legend}>
              <Formula tex={concept.formula.tex} />
            </FormulaBox>
          </Section>
        )}

        {concept.example && (
          <Section title={concept.example.title}>
            <div className="flex max-w-full flex-col gap-3">{concept.example.content}</div>
          </Section>
        )}

        <Section title="É bom ou ruim?">
          <div className="max-w-prose">{concept.reading}</div>
          {readingCharts[id]}
        </Section>

        {concept.cautions && (
          <Section title="Cuidado ao ler">
            <div className="flex max-w-prose flex-col gap-3">
              {concept.cautions.map((caution) => (
                <p key={caution.title}>
                  <strong>{caution.title}</strong> {caution.text}
                </p>
              ))}
            </div>
          </Section>
        )}

        <Section title="Relacionados">
          <div className="flex flex-wrap gap-2">
            {concept.related.map((related) => (
              <Button
                key={related}
                variant="pill"
                render={<Link to={`/learn/${related}`} />}
                nativeButton={false}
              >
                {concepts[related].title}
              </Button>
            ))}
          </div>
        </Section>

        <Section title="Fontes">
          <SourceList sources={concept.sources} />
        </Section>
      </article>

      <ConceptAside id={id} />
    </div>
  );
}
