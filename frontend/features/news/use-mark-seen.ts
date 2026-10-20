import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage, post } from "@/shared/lib/api";
import { invalidateKeys, queryKeys } from "@/shared/lib/query-keys";
import type { components } from "@/types/openapi.generated";

type Seen = components["schemas"]["SeenDTO"];

/** Marca as fontes como vistas até o período mais recente em cache. */
export function useMarkSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Seen) => post("/api/news/seen", { body }),
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.news]),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
