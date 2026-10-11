import {
  ArrowDown,
  ArrowRightFromLine,
  ArrowRightToLine,
  ArrowUp,
  type LucideIcon,
} from "lucide-react";

import {
  type DiagramEffect,
  type DiagramFlow,
  effectColor,
} from "@/shared/components/diagram/diagram-spec";
import { Badge } from "@/shared/components/ui/badge";

function EdgeTag({
  icon: Icon,
  iconClass,
  label,
}: {
  icon: LucideIcon;
  iconClass?: string;
  label: string;
}) {
  return (
    <Badge variant="outline" className="align-middle font-semibold">
      <Icon className={iconClass} />
      {label}
    </Badge>
  );
}

/** As etiquetas de uma seta: o que ela leva para dentro ou para fora ("→| entra",
"|→ sai") e o efeito que tem nome ("↑ sobe", "↓ segura"). */
export function EdgeTags({
  flow,
  effect,
}: {
  flow?: DiagramFlow | undefined;
  effect?: DiagramEffect | undefined;
}) {
  return (
    <>
      {flow && (
        <EdgeTag
          icon={flow.direction === "in" ? ArrowRightToLine : ArrowRightFromLine}
          label={flow.label}
        />
      )}
      {effect?.label && (
        <EdgeTag
          icon={effect.direction === "up" ? ArrowUp : ArrowDown}
          iconClass={effectColor[effect.direction]}
          label={effect.label}
        />
      )}
    </>
  );
}
