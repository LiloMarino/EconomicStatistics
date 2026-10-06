import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage, post } from "@/shared/lib/api";
import { invalidateKeys, queryKeys } from "@/shared/lib/query-keys";
import { seriesLabels } from "@/shared/lib/series-labels";

export function useRefreshSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => post("/api/series/refresh"),
    onSuccess: ({ failed }) => {
      void invalidateKeys(queryClient, [queryKeys.series]);
      if (failed.length > 0) {
        const names = failed.map((id) => seriesLabels[id]).join(", ");
        toast.warning(`A fonte ainda não entregou o último mês de: ${names}.`);
      }
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
