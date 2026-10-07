/** Número para dentro do TeX com vírgula decimal: 0.0311 com 4 casas vira "0{,}0311".
As chaves impedem o TeX de tratar a vírgula como pontuação e abrir espaço depois dela. */
export function texDecimal(value: number, digits: number): string {
  return value.toFixed(digits).replace(".", "{,}");
}
