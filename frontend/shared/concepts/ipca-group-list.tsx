import { GroupChip } from "@/shared/components/group-chip";
import { ipcaGroupContents, ipcaGroupIds } from "@/shared/concepts/ipca-group-contents";
import { formatPercent } from "@/shared/lib/format";

/** Um bloco por grupo do IPCA, do mais pesado ao mais leve: o que ele junta, o peso no
índice e os subgrupos com exemplos. O id do bloco é o da série, para a busca levar até
ele. */
export function IpcaGroupList() {
  const ids = ipcaGroupIds.toSorted(
    (a, b) => ipcaGroupContents[b].weight - ipcaGroupContents[a].weight,
  );
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
      {ids.map((id) => {
        const group = ipcaGroupContents[id];
        return (
          <section
            key={id}
            id={id}
            className="bg-card flex scroll-mt-6 flex-col gap-3 rounded-xl px-4.5 py-4"
          >
            <div className="flex items-center justify-between gap-3">
              <GroupChip seriesId={id} />
              <span className="text-caption text-muted-foreground whitespace-nowrap">
                <strong className="text-foreground">{formatPercent(group.weight)}</strong> do IPCA
              </span>
            </div>
            <p>{group.summary}</p>
            <dl className="text-caption flex flex-col gap-2">
              {group.subgroups.map((subgroup) => (
                <div key={subgroup.name}>
                  <dt className="font-semibold">{subgroup.name}</dt>
                  {subgroup.examples.length > 0 && (
                    <dd className="text-muted-foreground">{subgroup.examples.join(", ")}</dd>
                  )}
                </div>
              ))}
            </dl>
          </section>
        );
      })}
    </div>
  );
}
