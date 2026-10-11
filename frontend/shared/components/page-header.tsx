import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  /** A linha embaixo do título: o que a tela mostra e de onde vem. */
  description?: ReactNode;
  /** Os controles da página, embaixo do título. Ficam presos no topo ao rolar, para
  trocar o período sem voltar ao começo da tela. */
  controls?: ReactNode;
}

/** O cabeçalho de toda tela: título, a linha de fonte e os controles. */
export function PageHeader({ title, description, controls }: PageHeaderProps) {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-page-title">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </header>
      {/* Irmão do cabeçalho, e não filho, para o sticky valer na tela inteira */}
      {controls && (
        <div className="bg-background/95 sticky top-0 z-20 -mx-3 -mt-7 border-b px-3 py-3 backdrop-blur">
          {controls}
        </div>
      )}
    </>
  );
}
