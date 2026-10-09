import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

import { explainerIds, explainers } from "@/shared/concepts/explainers";

/** As leituras mais longas, que explicam o mecanismo por trás dos números. */
export function ExplainerList() {
  return (
    <section aria-labelledby="explainers" className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-1">
        <h2 id="explainers" className="text-section-title">
          Como as coisas se ligam
        </h2>
        <p className="text-caption text-muted-foreground">
          Leituras mais longas, que explicam o mecanismo por trás dos números
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
        {explainerIds.map((id) => (
          <Link
            key={id}
            to={`/learn/explainers/${id}`}
            className="bg-card hover:ring-border flex flex-col gap-2 rounded-xl px-5 py-4 hover:ring-2"
          >
            <strong className="text-base leading-snug">{explainers[id].title}</strong>
            <span className="text-caption text-muted-foreground">{explainers[id].summary}</span>
            <span className="text-eyebrow text-muted-foreground mt-auto inline-flex items-center gap-1 normal-case">
              <Clock className="size-3.5" />
              {explainers[id].readingMinutes} min
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
