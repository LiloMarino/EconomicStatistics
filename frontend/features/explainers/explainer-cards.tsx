import { Link } from "react-router-dom";

export interface ExplainerCard {
  title: string;
  text: string;
  to?: string;
  link?: string;
}

/** Os cartões que fecham um explicador: o que freia, o que perguntar, onde ver o número. */
export function ExplainerCards({ title, cards }: { title: string; cards: ExplainerCard[] }) {
  return (
    <section className="flex flex-col gap-3.5">
      <h2 className="font-heading text-section-title">{title}</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
        {cards.map((card) => (
          <div key={card.title} className="bg-card flex flex-col gap-1.5 rounded-xl p-4">
            <strong>{card.title}</strong>
            <span className="text-caption text-muted-foreground">{card.text}</span>
            {card.to && (
              <Link to={card.to} className="text-caption font-semibold">
                {card.link}
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
