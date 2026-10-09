import { BookOpen } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { ExplainerArticle } from "@/features/explainers/explainer-article";
import { isExplainerId } from "@/shared/concepts/explainers";
import { Button } from "@/shared/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";

export function ExplainerPage() {
  const { explainerId = "" } = useParams();

  if (!isExplainerId(explainerId)) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpen />
          </EmptyMedia>
          <EmptyTitle>Explicador não encontrado</EmptyTitle>
          <EmptyDescription>
            Este endereço não corresponde a nenhum explicador do Aprender.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" render={<Link to="/learn" />} nativeButton={false}>
            Voltar ao Aprender
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return <ExplainerArticle id={explainerId} />;
}
