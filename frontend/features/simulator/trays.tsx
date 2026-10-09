import type { Simulation } from "@/features/simulator/use-simulator";
import { TrayItem } from "@/shared/components/explained-card";
import { Formula, FormulaBox } from "@/shared/components/formula";
import { texDecimal } from "@/shared/lib/tex";

/** A bandeja "Como funciona": a corrida entre r e g, o que a conta não vê e por que o
tamanho da dívida não basta. */
export function HowItWorks() {
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-x-8 gap-y-5">
      <TrayItem title="A corrida entre r e g" concept="r-minus-g">
        <p>
          Todo ano a dívida cresce pelo juro (r) e o PIB cresce por g. Se r passa g, a dívida/PIB
          sobe sozinha; se g passa r, ela encolhe sozinha. O primário só acelera ou freia.
        </p>
      </TrayItem>
      <TrayItem title="O que o simulador não vê">
        <p>
          Ele mantém juro, crescimento e primário fixos pelo horizonte inteiro. Na vida real o juro
          sobe quando o mercado desconfia, e a dívida em moeda estrangeira salta quando o câmbio
          desvaloriza, como na Argentina em 2002.
        </p>
      </TrayItem>
      <TrayItem title="Por que o tamanho não basta">
        <p>
          Dever na própria moeda, para gente de dentro, com juro baixo, é bem diferente de dever em
          moeda que o país não emite. Compare Japão e Grécia no gráfico e na seção de baixo.
        </p>
      </TrayItem>
    </div>
  );
}

/** A bandeja "Ver a conta": a fórmula de cada ano e o primeiro ano com os números do
cenário. */
export function Calculation({
  simulation,
  debt,
  rate,
  growth,
  primary,
}: {
  simulation: Simulation;
  debt: number;
  rate: number;
  growth: number;
  primary: number;
}) {
  const { grown_debt: grownDebt, debt: firstYearDebt } = simulation.first_year;
  return (
    <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-x-10 gap-y-6">
      <TrayItem title="A fórmula de cada ano">
        <FormulaBox
          legend={[
            { symbol: "d_t", text: <>dívida/PIB no ano t</> },
            { symbol: "r", text: <>juro da dívida, faz ela crescer</> },
            { symbol: "g", text: <>crescimento do PIB, faz a razão encolher</> },
            { symbol: "p", text: <>primário: superávit abate a dívida</> },
          ]}
        >
          <Formula tex="d_{t+1} = d_t \times \dfrac{1 + r}{1 + g} - p" />
        </FormulaBox>
      </TrayItem>
      <TrayItem title="O primeiro ano do seu cenário">
        <FormulaBox>
          <Formula
            flushLeft
            tex={`d_1 = ${texDecimal(debt, 4)} \\times \\dfrac{1 + ${texDecimal(rate, 4)}}{1 + ${texDecimal(growth, 4)}} - \\left(${texDecimal(primary, 4)}\\right)`}
          />
          <Formula
            flushLeft
            tex={`= ${texDecimal(grownDebt, 4)} - \\left(${texDecimal(primary, 4)}\\right) = \\mathbf{${texDecimal(firstYearDebt * 100, 2)}\\%}`}
          />
        </FormulaBox>
        <p className="text-caption text-muted-foreground">
          O app repete essa conta ano a ano. Juro e crescimento se compõem dividindo, nunca
          subtraindo.
        </p>
      </TrayItem>
    </div>
  );
}
