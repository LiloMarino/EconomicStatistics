import { Search } from "lucide-react";

import { ExplainerList } from "@/features/learn/explainer-list";
import { Glossary } from "@/features/learn/glossary";
import { type TopicFilter, useLearnView } from "@/features/learn/use-learn-view";
import { PageHeader } from "@/shared/components/page-header";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import { isTopic, topicLabels, topics } from "@/shared/concepts/concept";

export function LearnPage() {
  const { query, topic, setQuery, setTopic } = useLearnView();

  return (
    <>
      <PageHeader
        title="Aprender"
        description="Cada conceito que aparece no app, com fórmula, exemplo e onde a fonte publica"
        controls={
          <div className="flex flex-col gap-4">
            <InputGroup className="h-12">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                aria-label="Buscar conceito"
                placeholder="Buscar: acumulado, efeito base, poder de compra…"
                defaultValue={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </InputGroup>
            <ToggleGroup
              variant="pill"
              aria-label="Tema"
              value={[topic]}
              className="flex-wrap"
              onValueChange={([next]) => {
                const chosen: TopicFilter | undefined =
                  next === "all" ? "all" : next && isTopic(next) ? next : undefined;
                if (chosen) setTopic(chosen);
              }}
            >
              <ToggleGroupItem value="all">Todos</ToggleGroupItem>
              {topics.map((key) => (
                <ToggleGroupItem key={key} value={key}>
                  {topicLabels[key]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        }
      />
      {/* Os explicadores só aparecem na lista inteira, sem busca nem tema */}
      {!query.trim() && topic === "all" && <ExplainerList />}
      <Glossary query={query} topic={topic} />
    </>
  );
}
