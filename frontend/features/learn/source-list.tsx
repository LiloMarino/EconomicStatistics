import type { ConceptSource } from "@/shared/concepts/concept";

/** As fontes oficiais de uma página do Aprender, cada uma com o que ela comprova. */
export function SourceList({ sources }: { sources: ConceptSource[] }) {
  return (
    <ol className="text-caption flex max-w-prose list-decimal flex-col gap-2 pl-5">
      {sources.map((source) => (
        <li key={source.url + source.backs}>
          <a href={source.url} target="_blank" rel="noreferrer" className="font-semibold">
            {source.name} ↗
          </a>
          <span className="text-muted-foreground"> · {source.backs}</span>
        </li>
      ))}
    </ol>
  );
}
