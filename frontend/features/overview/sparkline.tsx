const WIDTH = 240;
const HEIGHT = 52;
const PADDING = 6;

/** A linha do indicador nos últimos pontos, sem eixo: só a forma e onde ela termina. */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  if (values.length < 2) return null;
  const low = Math.min(...values);
  const span = Math.max(...values) - low || 1;
  const points = values.map((value, index) => ({
    x: (index / (values.length - 1)) * (WIDTH - 2 * PADDING) + PADDING,
    y: HEIGHT - PADDING - ((value - low) / span) * (HEIGHT - 2 * PADDING),
  }));
  const last = points.at(-1);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={label}
      className="mt-auto block h-auto w-full overflow-visible"
    >
      <polyline
        points={points.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-muted-foreground"
      />
      {last && <circle cx={last.x} cy={last.y} r={3.5} className="fill-foreground" />}
    </svg>
  );
}
