import type { ReactNode } from "react";

import type { ConceptId } from "@/shared/concepts/concept";

/** Um nó do diagrama, posicionado à mão em pixels. */
export interface DiagramNode {
  id: string;
  title: string;
  /** O valor de hoje, já formatado, quando o nó tem série. */
  value?: string;
  subtitle: string;
  /** O conceito que a página do nó explica; sem ele, o nó não é link. */
  concept?: ConceptId;
  /** A cor da borda, como valor CSS: "var(--loop-debt)". */
  accent?: string;
  x: number;
  y: number;
  /** Altura mínima do nó, para os que têm subtítulo longo. */
  height?: number;
}

/** Uma seta entre dois nós. O texto explica a seta e aparece numerado abaixo do diagrama. */
export interface DiagramEdge {
  from: string;
  to: string;
  /** O grupo dá a cor à seta e diz em que passo ela fica acesa. */
  group: string;
  text: ReactNode;
  /** Quanto a curva se afasta da reta entre os nós; positivo curva para um lado, negativo para o outro. */
  bend?: number;
}

/** Um passo do seletor: mostra só as setas dos grupos dele. Sem grupos, mostra todas. */
export interface DiagramStep {
  id: string;
  label: string;
  title: string;
  intro: ReactNode;
  groups: string[];
}

export interface DiagramSpec {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  /** A cor de cada grupo de setas, como valor CSS. */
  groupColors: Record<string, string>;
  steps: [DiagramStep, ...DiagramStep[]];
  /** Altura da área do diagrama em pixels. */
  height: number;
  /** Largura da área em pixels; sem ela, 1000, a largura da página de explicador. */
  width?: number;
  /** O texto que o leitor de tela lê no lugar do desenho. */
  label: string;
}

export const NODE_WIDTH = 170;
export const NODE_MIN_HEIGHT = 64;

/** Se o grupo da seta fica aceso no passo: um passo sem grupos acende todas. */
export function isGroupActive(step: DiagramStep, group: string): boolean {
  return step.groups.length === 0 || step.groups.includes(group);
}
