import { ChartNoAxesCombined, Moon, PanelLeft, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { useRefreshSeries } from "@/features/series/use-refresh-series";
import { useSeriesStatus } from "@/features/series/use-series-status";
import { isActive, navGroups } from "@/layouts/navigation";
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
        value={[resolvedTheme ?? "dark"]}
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

function DataUntil() {
  const { data } = useSeriesStatus();
  const ipca = data?.find((item) => item.series_id === "ipca_general")?.last_ref_date;

  return (
    <div className="text-caption text-muted-foreground flex flex-col gap-1 px-3 group-data-[collapsible=icon]:hidden">
      {ipca ? (
        <span>
          IPCA até <strong className="text-foreground font-semibold">{formatMonth(ipca)}</strong>
        </span>
      ) : (
        <span>Buscando os dados…</span>
      )}
      <span>IBGE e Banco Central</span>
    </div>
  );
}

export function MainLayout() {
  const { pathname } = useLocation();
  const { mutate: refreshSeries } = useRefreshSeries();

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
          </SidebarHeader>

          {/* Navegação */}
          <SidebarContent>
            {navGroups.map((group) => (
              <SidebarGroup key={group.label} className="px-4 py-3">
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
                          isActive={isActive(to, pathname)}
                          tooltip={label}
                          render={<NavLink to={to} />}
                        >
                          <Icon />
                          <span>{label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          {/* Até quando há dado e tema */}
          <SidebarFooter className="gap-3 px-4 pb-6">
            <DataUntil />
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
