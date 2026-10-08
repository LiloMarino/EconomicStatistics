import { BookOpen, type LucideIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { navGroups } from "@/layouts/navigation";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/shared/components/ui/command";
import { Kbd } from "@/shared/components/ui/kbd";
import { SidebarMenuButton } from "@/shared/components/ui/sidebar";
import { type ConceptId, conceptIds } from "@/shared/concepts/concept";
import { concepts } from "@/shared/concepts/concepts";
import { ipcaGroupContents, ipcaGroupIds } from "@/shared/concepts/ipca-group-contents";
import { conceptSearchText, matches, normalize } from "@/shared/concepts/search-text";
import { groupIdentity } from "@/shared/lib/group-identity";
import { seriesLabels } from "@/shared/lib/series-labels";

const screens = navGroups.flatMap((group) => group.items);

// Sem nada digitado, a busca sugere os conceitos que mais aparecem nas telas
const suggested: ConceptId[] = ["ipca", "rolling-12m", "purchasing-power"];

/** O primeiro termo de `keywords` é o título: resultado que bate no título vem antes. */
function score(_value: string, search: string, keywords: string[] = []): number {
  const [title = ""] = keywords;
  if (normalize(title).includes(normalize(search.trim()))) return 1;
  return matches(keywords, search) ? 0.5 : 0;
}

/** O ícone do resultado num quadrado, que acende com o item escolhido. */
function ItemIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="bg-muted text-muted-foreground group-data-selected/command-item:bg-background inline-flex size-8 shrink-0 items-center justify-center rounded-lg">
      <Icon />
    </span>
  );
}

/** "Buscar": abre com Ctrl+K e leva a uma tela ou à página de um conceito em Aprender. */
export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // O atalho vale em qualquer tela
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(to: string) {
    setOpen(false);
    setSearch("");
    void navigate(to);
  }

  const shownConcepts = search.trim() ? conceptIds : suggested;

  return (
    <>
      <SidebarMenuButton
        variant="outline"
        size="nav"
        tooltip="Buscar"
        onClick={() => setOpen(true)}
      >
        <Search />
        <span className="text-muted-foreground truncate">Buscar</span>
        <Kbd className="ml-auto group-data-[collapsible=icon]:hidden">Ctrl K</Kbd>
      </SidebarMenuButton>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Buscar no app"
        description="Uma tela ou um conceito em Aprender"
        className="sm:max-w-160"
      >
        <Command filter={score}>
          <CommandInput
            placeholder="Busque telas e conceitos: IPCA, acumulado, salário mínimo…"
            value={search}
            onValueChange={setSearch}
            end={<Kbd>Esc</Kbd>}
          />
          <CommandList>
            <CommandEmpty>Nada com "{search}". Tente outra palavra.</CommandEmpty>

            {/* Telas */}
            <CommandGroup heading="Telas">
              {screens.map(({ to, label, icon: Icon, description, keywords }) => (
                <CommandItem
                  key={to}
                  value={`tela ${to}`}
                  keywords={[label, description, ...keywords]}
                  onSelect={() => go(to)}
                >
                  <ItemIcon icon={Icon} />
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold">{label}</span>
                    <span className="text-small text-muted-foreground truncate">{description}</span>
                  </span>
                  <CommandShortcut>Tela</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Conceitos */}
            <CommandGroup
              heading={search.trim() ? "Conceitos em Aprender" : "Conceitos mais buscados"}
            >
              {shownConcepts.map((id) => (
                <CommandItem
                  key={id}
                  value={`conceito ${id}`}
                  keywords={conceptSearchText(concepts[id])}
                  onSelect={() => go(`/learn/${id}`)}
                >
                  <ItemIcon icon={BookOpen} />
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold">{concepts[id].title}</span>
                    <span className="text-small text-muted-foreground truncate">
                      {concepts[id].summary}
                    </span>
                  </span>
                  <CommandShortcut>Conceito</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Grupos do IPCA, que levam ao bloco de cada um na página do grupo */}
            {search.trim() && (
              <CommandGroup heading="Grupos do IPCA">
                {ipcaGroupIds.map((id) => {
                  const group = ipcaGroupContents[id];
                  return (
                    <CommandItem
                      key={id}
                      value={`grupo ${id}`}
                      keywords={[
                        seriesLabels[id],
                        group.summary,
                        ...group.subgroups.flatMap((item) => [item.name, ...item.examples]),
                      ]}
                      onSelect={() => go(`/learn/ipca-group#${id}`)}
                    >
                      <ItemIcon icon={groupIdentity[id].icon} />
                      <span className="flex min-w-0 flex-col">
                        <span className="font-semibold">{seriesLabels[id]}</span>
                        <span className="text-small text-muted-foreground truncate">
                          {group.summary}
                        </span>
                      </span>
                      <CommandShortcut>Grupo do IPCA</CommandShortcut>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>

          {/* Atalhos */}
          <div className="text-small text-muted-foreground flex flex-wrap items-center gap-4 border-t px-3 py-2.5">
            <span className="inline-flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              navegar
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Kbd>Enter</Kbd>
              abrir
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Kbd>Esc</Kbd>
              fechar
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto font-semibold"
              onClick={() => go("/learn")}
            >
              Ver tudo em Aprender →
            </Button>
          </div>
        </Command>
      </CommandDialog>
    </>
  );
}
