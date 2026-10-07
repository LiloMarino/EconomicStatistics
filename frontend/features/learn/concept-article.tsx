import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Formula, FormulaBox } from "@/shared/components/formula";
import { Button } from "@/shared/components/ui/button";
import { type ConceptId, topicLabels } from "@/shared/concepts/concept";
import { concepts } from "@/shared/concepts/concepts";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-section-title">{title}</h2>
      {children}
    </section>
  );
}

/** Os fatos do conceito ao lado do texto: onde a fonte publica e em que telas ele aparece. */
function ConceptAside({ id }: { id: ConceptId }) {
  const { source, screens } = concepts[id];
  return (
    <aside
      aria-label="Resumo do conceito"
      className="bg-card text-caption flex flex-col gap-4 rounded-xl p-5"
    >
      {source && (
        <>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Fonte oficial</span>
            <a href={source.url} target="_blank" rel="noreferrer" className="font-semibold">
              {source.name} ↗
            </a>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Frequência</span>
            <strong>{source.frequency}</strong>
          </div>
        </>
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
      </article>

      <ConceptAside id={id} />
    </div>
  );
}
