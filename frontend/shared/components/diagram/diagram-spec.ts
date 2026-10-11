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
  /** O que a seta faz com um nó, quando o sentido da seta pode enganar: "sobe" e
  "segura", por exemplo. Aparece junto do número e, com o mouse na seta, como um
  triângulo no nó afetado. */
  effect?: DiagramEffect;
  /** Quando a seta é algo entrando num nó ou saindo dele, como o dólar que entra no
  país: a etiqueta diz "entra" ou "sai", e o efeito no preço fica só no triângulo. */
  flow?: DiagramFlow;
}

export interface DiagramFlow {
  direction: "in" | "out";
  label: string;
}

export interface DiagramEffect {
  direction: "up" | "down";
  /** A etiqueta junto do número; sem ela, o efeito aparece só no triângulo do nó. */
  label?: string;
  /** O nó afetado; sem ele, o nó de chegada. O dólar que entra no mercado faz o preço
  do próprio mercado cair, mas o dólar que sai dele faz o preço subir. */
  on?: string;
}

// As cores das tendências do app: subir em vermelho, cair em azul, como nos gráficos
export const effectColor = {
  up: "text-trend-up",
  down: "text-trend-down",
} as const;

/** O nó afetado pela seta sob o mouse e o sentido do efeito, para o triângulo no nó. */
export function hoveredEffect(
  hover: DiagramHover,
  edges: DiagramEdge[],
): { node: string; direction: DiagramEffect["direction"] } | null {
  if (!hover || !("edge" in hover)) return null;
  const edge = edges[hover.edge - 1];
  if (!edge?.effect) return null;
  return { node: edge.effect.on ?? edge.to, direction: edge.effect.direction };
}

/** O que está sob o mouse: uma seta, pelo número, ou um nó, pelo id. */
export type DiagramHover = { edge: number } | { node: string } | null;

/** Se a seta fica em destaque com o que está sob o mouse: a própria seta, ou uma seta
que sai ou chega ao nó. */
export function isEdgeHighlighted(hover: DiagramHover, edge: DiagramEdge, number: number): boolean {
  if (!hover) return false;
  if ("edge" in hover) return hover.edge === number;
  return edge.from === hover.node || edge.to === hover.node;
}

/** Se o nó fica em destaque com o que está sob o mouse: o próprio nó, ou uma ponta da
seta sob o mouse. */
export function isNodeHighlighted(hover: DiagramHover, edges: DiagramEdge[], id: string): boolean {
  if (!hover) return false;
  if ("node" in hover) return hover.node === id;
  const edge = edges[hover.edge - 1];
  return edge?.from === id || edge?.to === id;
}

/** Um passo do seletor: mostra só as setas dos grupos dele. Sem grupos, mostra todas. */
export interface DiagramStep {
  id: string;
  label: string;
  title: string;
  intro: ReactNode;
  groups: string[];
  /** O que muda nos nós neste passo, por id: o mesmo fator dito do lado do caminho. */
  nodes?: Record<string, Partial<Pick<DiagramNode, "title" | "subtitle" | "accent">>>;
  /** O texto das setas neste passo, pelo número da seta. */
  edges?: Record<number, ReactNode>;
}

/** O desenho com o que o passo muda nos nós e no texto das setas. */
export function applyStep(spec: DiagramSpec, step: DiagramStep): DiagramSpec {
  if (!step.nodes && !step.edges) return spec;
  return {
    ...spec,
    nodes: spec.nodes.map((node) => ({ ...node, ...step.nodes?.[node.id] })),
    edges: spec.edges.map((edge, index) => ({
      ...edge,
      text: step.edges?.[index + 1] ?? edge.text,
    })),
  };
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
