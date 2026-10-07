import type { ReactNode } from "react";

import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

interface HintButtonProps {
  /** O que o "?" explica, para leitor de tela: "O que é o IPCA". */
  label: string;
  /** A explicação que tem conta e tabela pede o balão largo. */
  wide?: boolean;
  children: ReactNode;
}

/** O "?" que abre a definição de um número num balão. */
export function HintButton({ label, wide = false, children }: HintButtonProps) {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="hint" size="hint" aria-label={label} />}>
        ?
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={
          wide
            ? "text-caption max-h-[80vh] w-140 max-w-screen gap-4 overflow-y-auto p-4"
            : "text-caption w-80 p-4"
        }
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
