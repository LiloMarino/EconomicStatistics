import { lampFill, lampText } from "@/features/economy-health/lamp-styles";
import type { Lamp } from "@/features/economy-health/use-economy-health";

/** A lâmpada acesa com o nome do estado ao lado: a cor nunca é a única pista. */
export function LampLabel({ lamp, children }: { lamp: Lamp; children: string }) {
  return (
    <span className={`flex items-center gap-2.5 font-bold ${lampText({ lamp })}`}>
      <span
        aria-hidden="true"
        className={`ring-muted size-4.5 rounded-full ring-4 ${lampFill({ lamp })}`}
      />
      {children}
    </span>
  );
}
