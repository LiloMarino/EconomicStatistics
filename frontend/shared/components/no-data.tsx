import { CircleAlert } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { getApiErrorMessage } from "@/shared/lib/api";

/** O lugar de uma tela quando a consulta falha: a mensagem que a API devolveu. */
export function NoData({ error }: { error: Error }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert />
        </EmptyMedia>
        <EmptyTitle>Sem dados para mostrar</EmptyTitle>
        <EmptyDescription>{getApiErrorMessage(error)}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
