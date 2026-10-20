import { ChartNoAxesCombined, Moon, PanelLeft, Sun } from "lucide-react";
import { useEffect, useMemo } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { newsByScreen } from "@/features/news/news-by-screen";
import { useMarkSeen } from "@/features/news/use-mark-seen";
import { useRefreshSeries } from "@/features/series/use-refresh-series";
import { useNews } from "@/shared/hooks/use-news";
import { useSeriesStatus } from "@/shared/hooks/use-series-status";
import { useTheme } from "@/shared/hooks/use-theme";
import { CommandSearch } from "@/layouts/command-search";
import { defaultFooter, isActive, navGroups } from "@/shared/lib/navigation";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { Toaster } from "@/shared/components/ui/sonner";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { formatMonth } from "@/shared/lib/format";

function CollapseButton() {
  const { state, toggleSidebar } = useSidebar();
  const label = state === "expanded" ? "Recolher a sidebar" : "Expandir a sidebar";
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={`${label} (Ctrl B)`}
      onClick={toggleSidebar}
    >
      <PanelLeft />
    </Button>
  );
}

function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="text-caption text-muted-foreground flex items-center justify-between pr-1 pl-2.5 group-data-[collapsible=icon]:hidden">
      Tema
      <ToggleGroup
        variant="segmented"
        size="sm"
        aria-label="Tema"
        value={[resolvedTheme]}
        onValueChange={([value]) => {
          if (value) setTheme(value);
        }}
      >
        <ToggleGroupItem value="light" aria-label="Claro">
          <Sun />
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Escuro">
          <Moon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

/** Até quando há dado na tela aberta, e quem o publica. */
function DataUntil({ pathname }: { pathname: string }) {
  const { data } = useSeriesStatus();
  const { until, sources } =
    navGroups.flatMap((group) => group.items).find((item) => isActive(item.to, pathname))?.footer ??
    defaultFooter;
  const last = until && data?.find((item) => item.series_id === until.series)?.last_ref_date;

  return (
    <div className="text-caption text-muted-foreground flex flex-col gap-1 px-3 group-data-[collapsible=icon]:hidden">
      {until &&
        (last ? (
          <span>
            {until.label} até{" "}
            <strong className="text-foreground font-semibold">{formatMonth(last)}</strong>
          </span>
        ) : (
          <span>Buscando os dados…</span>
        ))}
      <span>{sources}</span>
    </div>
  );
}

/** Acessar a tela-casa de uma fonte marca o que chegou nela como visto. A Visão geral
não é casa de fonte nenhuma, e por isso a lista de novidades dela fica até você abrir a
tela de cada uma. */
function useMarkScreenSeen(pathname: string) {
  const { data } = useNews();
  const { mutate: markSeen } = useMarkSeen();
  // A query devolve o mesmo objeto enquanto o conteúdo não muda: a marca dispara ao
  // entrar na tela e quando o refresh traz fonte nova a ela, uma vez cada
  const screen = useMemo(
    () => data && newsByScreen(data).find((item) => isActive(item.screen.to, pathname)),
    [data, pathname],
  );

  useEffect(() => {
    if (!screen) return;
    markSeen({
      series: screen.series.map((item) => item.series_id),
      datasets: screen.datasets.map((item) => item.dataset),
    });
  }, [screen, markSeen]);
}

export function MainLayout() {
  const { pathname } = useLocation();
  const { mutate: refreshSeries } = useRefreshSeries();
  const { data: news } = useNews();
  const newsCount = new Map(
    (news ? newsByScreen(news) : []).map((item) => [
      item.screen.to,
      item.series.length + item.datasets.length,
    ]),
  );
  useMarkScreenSeen(pathname);

  // A cada abertura, o backend confere o que falta no cache de séries
  useEffect(() => {
    refreshSeries();
  }, [refreshSeries]);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          {/* Nome do app e recolher */}
          <SidebarHeader className="px-3 pt-6">
            <div className="flex items-center justify-between gap-2 pl-2 group-data-[collapsible=icon]:pl-0">
              <NavLink
                to="/"
                className="flex items-center gap-2.5 group-data-[collapsible=icon]:hidden"
              >
                <span className="bg-foreground text-background inline-flex size-8 items-center justify-center rounded-lg">
                  <ChartNoAxesCombined className="size-4.5" />
                </span>
                <span className="font-heading text-xl font-bold tracking-tight whitespace-nowrap">
                  Economia BR
                </span>
              </NavLink>
              <CollapseButton />
            </div>
            <SidebarMenu className="pt-2">
              <SidebarMenuItem>
                <CommandSearch />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          {/* Navegação */}
          <SidebarContent>
            {navGroups.map((group) => (
              <SidebarGroup key={group.label} className="px-4 py-2">
                <SidebarGroupLabel className="text-eyebrow uppercase">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map(({ to, label, icon: Icon }) => (
                      <SidebarMenuItem key={to}>
                        <SidebarMenuButton
                          variant="nav"
                          size="nav"
                          className="h-9"
                          isActive={isActive(to, pathname)}
                          tooltip={label}
                          render={<NavLink to={to} />}
                        >
                          <Icon />
                          <span>{label}</span>
                          {newsCount.has(to) && (
                            <Badge
                              variant="count-new"
                              className="ml-auto group-data-[collapsible=icon]:hidden"
                              aria-label={`${newsCount.get(to)} com dado novo`}
                            >
                              {newsCount.get(to)}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          {/* Até quando há dado e tema */}
          <SidebarFooter className="gap-2 px-4 pb-4">
            <DataUntil pathname={pathname} />
            <ThemeSwitch />
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="min-w-0">
          {/* No celular, a sidebar abre por aqui */}
          <div className="p-3 md:hidden">
            <SidebarTrigger />
          </div>
          <main className="flex flex-1 flex-col px-6 pt-10 pb-24 md:px-12">
            <div className="mx-auto flex w-full max-w-280 flex-col gap-10">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
        <Toaster richColors />
      </SidebarProvider>
    </TooltipProvider>
  );
}
