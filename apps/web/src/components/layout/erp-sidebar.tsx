import { NavLink, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { themeClasses } from "@/lib/theme-classes";
import {
  Activity,
  Banknote,
  Building2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  HandCoins,
  LayoutDashboard,
  ShieldCheck,
  Truck,
  UserCog,
  WalletCards,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    title: "Principal",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Monitoramento", url: "/monitoramento", icon: Activity },
      { title: "Relatórios", url: "/relatorios", icon: ClipboardList },
    ],
  },
  {
    title: "Gestão",
    items: [
      { title: "Financeiro", url: "/financeiro", icon: HandCoins },
      { title: "Cadastros", url: "/cadastros", icon: Building2 },
      { title: "Frota", url: "/frota", icon: Truck },
      { title: "RH", url: "/rh", icon: UserCog },
    ],
  },
  {
    title: "Sistema",
    items: [{ title: "Conta", url: "/conta", icon: ShieldCheck }],
  },
];

const quickIndicators = [
  { label: "Fluxo positivo", icon: Banknote },
  { label: "Custos ativos", icon: CreditCard },
  { label: "Carteira", icon: WalletCards },
];

export function ErpSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="px-4 py-4">
        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(79,70,229,0.18),rgba(15,23,42,0.92))] p-4 text-white shadow-[0_20px_50px_-24px_rgba(79,70,229,0.65)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/15 backdrop-blur">
              <Truck className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Da Vinci ERP</p>
              <p className="truncate text-xs text-white/65">
                Enterprise Command Center
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {quickIndicators.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/8 px-2 py-2 backdrop-blur"
                >
                  <Icon className="mb-2 size-3.5 text-white/75" />
                  <p className="text-[10px] leading-4 text-white/75">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75">
              {group.title}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={active}
                        className={cn(
                          "h-11 rounded-2xl border border-transparent transition-all duration-200",
                          active
                            ? themeClasses.gradientSidebarActive
                            : "hover:border-white/10 hover:bg-card/70"
                        )}
                      >
                        <NavLink to={item.url}>
                          <Icon className="size-4" />
                          <span className="font-medium">{item.title}</span>
                          <ChevronRight className="ml-auto size-4 opacity-40" />
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-4 pb-4">
        <Separator className="mb-4 bg-white/10" />

        <div className="rounded-[24px] border border-white/10 bg-card/70 p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.6)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Sistema saudável</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ambiente estável e pronto para operação.
              </p>
            </div>

            <div className="size-3 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}