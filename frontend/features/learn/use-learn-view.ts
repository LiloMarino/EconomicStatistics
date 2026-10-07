import { useSearchParams } from "react-router-dom";

import { isTopic, type Topic } from "@/shared/concepts/concept";

export type TopicFilter = Topic | "all";

/** A busca (`?q=`) e o tema (`?topic=`) do glossário moram na URL. */
export function useLearnView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topic = searchParams.get("topic") ?? "";

  function update(key: "q" | "topic", value: string) {
    setSearchParams(
      (params) => {
        if (value) params.set(key, value);
        else params.delete(key);
        return params;
      },
      { replace: true, preventScrollReset: true },
    );
  }

  return {
    query: searchParams.get("q") ?? "",
    topic: isTopic(topic) ? topic : ("all" as TopicFilter),
    setQuery: (value: string) => update("q", value),
    setTopic: (value: TopicFilter) => update("topic", value === "all" ? "" : value),
  };
}
