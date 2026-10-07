import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

interface HintButtonProps {
  /** O que o "?" explica, para leitor de tela: "O que é o IPCA". */
  label: string;
  /** O botão no pé do balão, que fecha o balão e leva à explicação completa. */
  action?: { label: string; icon: LucideIcon; onSelect: () => void };
  children: ReactNode;
}

/** O "?" que abre a definição de um número num balão. */
export function HintButton({ label, action, children }: HintButtonProps) {
  const ActionIcon = action?.icon;
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="hint" size="hint" aria-label={label} />}>
        ?
      </PopoverTrigger>
      <PopoverContent align="end" className="text-caption w-80 p-4">
        {children}
        {action && ActionIcon && (
          <PopoverClose
            render={<Button variant="pill" size="sm" className="self-start" />}
            onClick={action.onSelect}
          >
            {action.label}
            <ActionIcon />
          </PopoverClose>
        )}
      </PopoverContent>
    </Popover>
  );
}
