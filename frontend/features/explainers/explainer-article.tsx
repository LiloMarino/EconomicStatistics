import type { ComponentType } from "react";
import { Link } from "react-router-dom";

import { DebtSustainability } from "@/features/explainers/debt-sustainability";
import { type ExplainerId, explainers } from "@/shared/concepts/explainers";
import { LoopsAndBridges } from "@/features/explainers/loops-and-bridges";
import { FiscalDominance } from "@/features/explainers/fiscal-dominance";
import { InertiaAndReal } from "@/features/explainers/inertia-and-real";
import { MoneyPrinting } from "@/features/explainers/money-printing";
import { ReservesAndFx } from "@/features/explainers/reserves-and-fx";
import { ThreeDebts } from "@/features/explainers/three-debts";
import { WhyRMinusG } from "@/features/explainers/why-r-minus-g";
import { SourceList } from "@/features/learn/source-list";
import { concepts } from "@/shared/concepts/concepts";

const contents: Record<ExplainerId, ComponentType> = {
  "loops-and-bridges": LoopsAndBridges,
  "why-r-minus-g": WhyRMinusG,
  "three-debts": ThreeDebts,
  "debt-sustainability": DebtSustainability,
  "inertia-and-real": InertiaAndReal,
  "money-printing": MoneyPrinting,
  "reserves-and-fx": ReservesAndFx,
  "fiscal-dominance": FiscalDominance,
};

/** A página de um explicador: o cabeçalho com os conceitos que ele usa, o conteúdo
próprio dele e as fontes. */
export function ExplainerArticle({ id }: { id: ExplainerId }) {
  const explainer = explainers[id];
  const Content = contents[id];

  return (
    <article className="flex min-w-0 flex-col gap-9">
      {/* Cabeçalho */}
      <header className="flex flex-col gap-3">
        <nav aria-label="Trilha" className="text-caption text-muted-foreground">
          <Link to="/learn">Aprender</Link> <span aria-hidden="true">›</span> Como as coisas se
          ligam
        </nav>
        <h1 className="font-heading text-page-title">{explainer.title}</h1>
        <p className="text-caption text-muted-foreground">
          Leitura de {explainer.readingMinutes} minutos · usa{" "}
          {explainer.uses.map((use, index) => (
            <span key={use}>
              {index > 0 && (index === explainer.uses.length - 1 ? " e " : ", ")}
              <Link to={`/learn/${use}`} className="font-semibold">
                {concepts[use].title}
              </Link>
            </span>
          ))}
        </p>
      </header>

      <Content />

      <section className="flex flex-col gap-3">
        <h2 className="text-section-title">Fontes</h2>
        <SourceList sources={explainer.sources} />
      </section>
    </article>
  );
}
