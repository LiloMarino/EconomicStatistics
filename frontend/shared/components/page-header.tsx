import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  /** A linha embaixo do título: o que a tela mostra e de onde vem. */
  description?: ReactNode;
  /** Os controles da página, embaixo do título. */
  controls?: ReactNode;
}

/** O cabeçalho de toda tela: título, a linha de fonte e os controles. */
export function PageHeader({ title, description, controls }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-page-title">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {controls}
    </header>
  );
}
