import { Sigma } from "lucide-react";
import { Link } from "react-router-dom";

import type { TopicFilter } from "@/features/learn/use-learn-view";
import {
  type ConceptId,
  conceptIds,
  type Topic,
  topicLabels,
  topics,
} from "@/shared/concepts/concept";
import { concepts } from "@/shared/concepts/concepts";
import { conceptSearchText, matches } from "@/shared/concepts/search-text";

function ConceptCard({ id }: { id: ConceptId }) {
  const concept = concepts[id];
  return (
    <Link
      to={`/learn/${id}`}
      className="bg-card hover:ring-border flex min-h-11 flex-col gap-1 rounded-xl px-4 py-3.5 hover:ring-2"
    >
      <span className="flex items-baseline justify-between gap-2">
        <strong className="text-base">{concept.title}</strong>
        {concept.abbr && <span className="text-small text-muted-foreground">{concept.abbr}</span>}
      </span>
      <span className="text-caption text-muted-foreground">{concept.summary}</span>
      {concept.formula && (
        <span className="text-eyebrow text-muted-foreground inline-flex items-center gap-1 normal-case">
          <Sigma className="size-3.5" />
          fórmula
        </span>
      )}
    </Link>
  );
}

interface GlossaryProps {
  query: string;
  topic: TopicFilter;
}

/** Os conceitos que passam na busca e no tema, agrupados por tema. */
export function Glossary({ query, topic }: GlossaryProps) {
  const found = conceptIds.filter((id) => matches(conceptSearchText(concepts[id]), query));
  const byTopic = new Map<Topic, ConceptId[]>();
  for (const id of found) {
    const { topic: key } = concepts[id];
    byTopic.set(key, [...(byTopic.get(key) ?? []), id]);
  }
  const groups = (topic === "all" ? topics : [topic])
    .map((key) => ({ key, ids: byTopic.get(key) ?? [] }))
    .filter((group) => group.ids.length > 0);
  const count = groups.reduce((total, group) => total + group.ids.length, 0);

  return (
    <section aria-labelledby="glossary" className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="glossary" className="text-section-title">
          Glossário
        </h2>
        <span className="text-caption text-muted-foreground">
          {count} {count === 1 ? "conceito" : "conceitos"}
        </span>
      </div>
      {groups.map((group) => (
        <div key={group.key} className="flex flex-col gap-2.5">
          <h3 className="text-eyebrow text-muted-foreground uppercase">{topicLabels[group.key]}</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2.5">
            {group.ids.map((id) => (
              <ConceptCard key={id} id={id} />
            ))}
          </div>
        </div>
      ))}
      {count === 0 && (
        <p className="text-muted-foreground">
          Nenhum conceito com esse nome. Tente outra palavra ou limpe o filtro de tema.
        </p>
      )}
    </section>
  );
}
