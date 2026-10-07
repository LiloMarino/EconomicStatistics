import { groupIdentity, type IpcaSeriesId } from "@/shared/lib/group-identity";
import { seriesLabels } from "@/shared/lib/series-labels";
import { cn } from "@/shared/lib/utils";

const sizes = {
  sm: { gap: "gap-2", box: "size-5.5 rounded-md", icon: "size-3.5", text: "text-label" },
  md: { gap: "gap-2.5", box: "size-7 rounded-lg", icon: "size-4", text: "text-body" },
  lg: { gap: "gap-3.5", box: "size-11 rounded-xl", icon: "size-6", text: "text-lg" },
};

interface GroupChipProps {
  seriesId: IpcaSeriesId;
  size?: keyof typeof sizes;
  showLabel?: boolean;
}

/** O nome de um grupo do IPCA com o ícone dele num quadrado tingido da cor do grupo. */
export function GroupChip({ seriesId, size = "md", showLabel = true }: GroupChipProps) {
  const { icon: Icon, color } = groupIdentity[seriesId];
  const scale = sizes[size];
  return (
    <span
      className={cn("inline-flex min-w-0 items-center whitespace-nowrap", scale.gap, scale.text)}
      style={{ "--chip": color }}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex shrink-0 items-center justify-center bg-(--chip)/18 text-(--chip)",
          scale.box,
        )}
      >
        <Icon className={scale.icon} />
      </span>
      {showLabel && (
        <span
          className={cn("truncate", seriesId === "ipca_general" ? "font-semibold" : "font-medium")}
        >
          {seriesLabels[seriesId]}
        </span>
      )}
    </span>
  );
}
