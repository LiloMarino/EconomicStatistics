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
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Recolher a sidebar"
      title="Recolher a sidebar (Ctrl B)"
      className="group-data-[collapsible=icon]:hidden"
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
    <p className="text-caption text-muted-foreground px-2.5 group-data-[collapsible=icon]:hidden">
      {ipca ? `IPCA até ${formatMonth(ipca)}` : "Buscando os dados…"}
    </p>
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
        <Sidebar variant="inset" collapsible="icon">
          {/* Nome do app e recolher */}
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-0.5">
                <SidebarMenuButton render={<NavLink to="/" />}>
                  <ChartNoAxesCombined />
                  <span className="font-semibold">Economia BR</span>
                </SidebarMenuButton>
                <CollapseButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          {/* Navegação */}
          <SidebarContent>
            {navGroups.map((group) => (
              <SidebarGroup key={group.label} className="py-1">
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map(({ to, label, icon: Icon }) => (
                      <SidebarMenuItem key={to}>
                        <SidebarMenuButton
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
          <SidebarFooter className="gap-1.5">
            <DataUntil />
            <ThemeSwitch />
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="min-w-0">
          {/* No celular, a sidebar abre por aqui */}
          <div className="p-3 md:hidden">
            <SidebarTrigger />
          </div>
          <main className="flex flex-1 flex-col gap-6 p-6">
            <Outlet />
          </main>
        </SidebarInset>
        <Toaster richColors />
      </SidebarProvider>
    </TooltipProvider>
  );
}
