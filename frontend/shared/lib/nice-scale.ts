/** O menor passo "redondo" (1, 2, 2,5 ou 5 vezes uma potência de 10) que cobre `value`. */
function niceStep(value: number): number {
  const power = 10 ** Math.floor(Math.log10(value));
  const multiplier = [1, 2, 2.5, 5, 10].find((candidate) => candidate * power >= value) ?? 10;
  return multiplier * power;
}

/** Ticks em passo redondo que cobrem de `min` a `max`, com o zero entre eles quando o
intervalo o cruza. O primeiro e o último viram o domínio do eixo. */
export function niceTicks(min: number, max: number, intervals = 4): number[] {
  const step = niceStep((max - min) / intervals || 0.01);
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let index = 0; start + index * step <= end + step / 2; index += 1) {
    ticks.push(Number((start + index * step).toFixed(10)));
  }
  return ticks;
}
