import { BookOpen } from "lucide-react";

import type { ExternalSector } from "@/features/external-sector/use-external-sector";
import { ExplainedCard, TrayItem } from "@/shared/components/explained-card";
import { MoneyExample } from "@/shared/components/money-example";
import { formatMoney, formatMonth, formatShortPercent } from "@/shared/lib/format";

type NationalIncome = NonNullable<ExternalSector["national_income"]>;

// O exemplo escala as frações da API a R$ 100 produzidos
const EXAMPLE_GDP = 100;

/** Quanto do PIB fica no país: o PIB inteiro contra a renda nacional, que tira a renda
que vai para fora como lucro e juros e soma a que vem de fora. */
export function NationalIncomeCard({ income }: { income: NationalIncome }) {
  const money = (share: number) => formatMoney(EXAMPLE_GDP * share);
  return (
    <ExplainedCard
      title="Quanto do que se produz aqui fica no país"
      subtitle={`PIB e renda nacional bruta, % do PIB em 12 meses · até ${formatMonth(income.ref_date)}`}
      explain={{
        label: "Como ler",
        icon: BookOpen,
        heading: "COMO LER",
        content: (
          <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-x-8 gap-y-5">
            <TrayItem title="PIB" color="var(--foreground)" concept="gdp">
              <p>
                Tudo o que se produz no território, de quem quer que seja a empresa: a fábrica de
                uma montadora estrangeira aqui entra inteira.
              </p>
            </TrayItem>
            <TrayItem title="Renda nacional" color="var(--ok)" concept="primary-income">
              <p>
                O que sobra para quem é daqui: o PIB menos o lucro e os juros que vão para fora,
                mais o que empresas e pessoas daqui recebem lá fora.
              </p>
            </TrayItem>
            <TrayItem title="Com dinheiro na mão: R$ 100 produzidos aqui">
              <MoneyExample
                rows={[
                  { label: "Produzido no Brasil (o PIB)", value: money(1) },
                  { label: "Renda que vem de fora", value: money(income.received) },
                  { label: "Renda que vai para fora", value: money(income.sent) },
                  {
                    label: "Fica no país (a renda nacional)",
                    value: money(income.kept),
                    total: true,
                  },
                ]}
              >
                A renda que vai e vem é a renda primária das transações correntes: lucro de empresa,
                juro de dívida e salário. No Brasil sai mais do que entra, porque há mais empresa e
                credor estrangeiro aqui do que brasileiro lá fora.
              </MoneyExample>
            </TrayItem>
          </div>
        ),
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="text-small grid grid-cols-[10rem_1fr_4rem] items-center gap-3">
          <span>PIB</span>
          <span className="bg-foreground h-5 rounded-sm" />
          <strong className="text-right tabular-nums">{formatShortPercent(1)}</strong>
          <span>Renda nacional</span>
          <span className="flex h-5">
            <span
              className="bg-ok w-(--kept) rounded-l-sm"
              style={{ "--kept": `${income.kept * 100}%` }}
            />
            <span className="bg-trend-up/40 flex-1 rounded-r-sm" />
          </span>
          <strong className="text-right tabular-nums">{formatShortPercent(income.kept)}</strong>
        </div>
        <p>
          De cada R$ 100 produzidos no Brasil, {money(income.net_sent)} saem como lucro e juros
          pagos lá fora, já descontado o que entra. A parte vermelha da segunda barra é o que o PIB
          conta e a renda nacional não.
        </p>
      </div>
    </ExplainedCard>
  );
}
