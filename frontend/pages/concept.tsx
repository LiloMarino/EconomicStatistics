import { BookOpen } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { ConceptArticle } from "@/features/learn/concept-article";
import { Button } from "@/shared/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { isConceptId } from "@/shared/concepts/concept";

export function ConceptPage() {
  const { conceptId = "" } = useParams();

  if (!isConceptId(conceptId)) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpen />
          </EmptyMedia>
          <EmptyTitle>Conceito não encontrado</EmptyTitle>
          <EmptyDescription>
            Este endereço não corresponde a nenhum conceito do glossário.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" render={<Link to="/learn" />} nativeButton={false}>
            Ver o glossário
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return <ConceptArticle id={conceptId} />;
}
