import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardTray,
} from "@/shared/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import type { ConceptId } from "@/shared/concepts/concept";
import { concepts } from "@/shared/concepts/concepts";

interface ExplainedCardProps {
  id?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Controles do cartão, à esquerda do botão da explicação. */
  actions?: ReactNode;
  explain: {
    /** O texto do botão: "Como ler", "Ver a conta". */
    label: string;
    icon: LucideIcon;
    /** O rótulo no topo da bandeja: "COMO LER". */
    heading: ReactNode;
    content: ReactNode;
  };
  /** Aberta por fora quando outro controle do cartão pede a conta. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/** Um gráfico com título e, no pé, a bandeja que explica como lê-lo. A bandeja começa
fechada e abre pelo botão do cabeçalho. */
export function ExplainedCard({
  id,
  title,
  subtitle,
  actions,
  explain,
  open,
  onOpenChange,
  children,
}: ExplainedCardProps) {
  const Icon = explain.icon;
  return (
    <Collapsible
      open={open}
      onOpenChange={(next) => onOpenChange?.(next)}
      render={<Card variant="sheet" id={id} />}
    >
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
        <CardAction className="flex flex-wrap items-center gap-3">
          {actions}
          <CollapsibleTrigger render={<Button variant="pill" size="sm" />}>
            <Icon />
            {explain.label}
          </CollapsibleTrigger>
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CollapsibleContent render={<CardTray />}>
        <span className="text-eyebrow text-muted-foreground col-span-full flex items-center gap-2">
          <Icon className="size-3.5" />
          {explain.heading}
        </span>
        {explain.content}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface TrayItemProps {
  title: ReactNode;
  /** O conceito do catálogo de que o bloco trata; o pé do bloco leva à página dele. */
  concept?: ConceptId;
  /** A cor da série de que o bloco trata, a mesma do gráfico: quando o cartão mostra dois
  conceitos, cada um ganha o seu bloco, marcado pela cor dele. */
  color?: string;
  children: ReactNode;
}

/** Um bloco da bandeja: o título curto e o texto. */
export function TrayItem({ title, concept, color, children }: TrayItemProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {color ? (
        <h3 className="flex items-center gap-2 font-bold" style={{ "--swatch": color }}>
          <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-xs bg-(--swatch)" />
          {title}
        </h3>
      ) : (
        <h3 className="font-bold">{title}</h3>
      )}
      {children}
      {concept && (
        <Link to={`/learn/${concept}`} className="text-caption self-start font-semibold">
          {concepts[concept].title} em Aprender →
        </Link>
      )}
    </div>
  );
}
