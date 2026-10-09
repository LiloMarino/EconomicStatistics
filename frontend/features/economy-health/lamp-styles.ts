import { cva } from "class-variance-authority";

export const lampText = cva("", {
  variants: {
    lamp: { green: "text-ok", yellow: "text-caution", red: "text-destructive" },
  },
});

/** O preenchimento de um bloco com a cor da lâmpada; sem faixa no ano, ele fica apagado. */
export const lampFill = cva("", {
  variants: {
    lamp: { green: "bg-ok", yellow: "bg-caution", red: "bg-destructive", none: "bg-muted" },
  },
});
