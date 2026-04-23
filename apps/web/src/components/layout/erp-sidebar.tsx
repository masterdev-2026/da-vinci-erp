import { NavLink, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Banknote,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CreditCard,
  HandCoins,
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  Truck,
  UserCog,
  WalletCards,
} from "lucide-react";

import { themeClasses } from "@/lib/theme-classes";
import { cn } from "@/lib/utils";

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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const sidebarActiveItemClass =
  "border border-white/10 bg-[linear-gradient(135deg,rgba(29,78,216,0.88)_0%,rgba(220,38,38,0.82)_100%)] text-white shadow-[0_10px_30px_-12px_rgba(29,78,216,0.45)]";

type NavSubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  children?: NavSubItem[];
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
      {
        title: "Financeiro",
        url: "/financeiro",
        icon: HandCoins,
        children: [
          { title: "Contas a Receber", url: "/financeiro/contas-a-receber" },
          { title: "Contas a Pagar", url: "/financeiro/contas-a-pagar" },
        ],
      },
      {
  title: "Cadastros",
  url: "/cadastros",
  icon: Building2,
  children: [
    { title: "Clientes", url: "/cadastros/clientes" },
    { title: "Fornecedores", url: "/cadastros/fornecedores" },
    { title: "Bancos", url: "/cadastros/bancos" },
    { title: "Categorias", url: "/cadastros/categorias" },
  ],
},
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

function isRouteActive(pathname: string, url: string) {
  if (url === "/") return pathname === url;
  return pathname === url || pathname.startsWith(`${url}/`);
}

function isAnyChildActive(pathname: string, children?: NavSubItem[]) {
  if (!children?.length) return false;
  return children.some((child) => isRouteActive(pathname, child.url));
}

export function ErpSidebar() {
  const location = useLocation();

  const defaultOpenMenus = useMemo(() => {
    const initialState: Record<string, boolean> = {};

    groups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children?.length) {
          initialState[item.title] =
            isRouteActive(location.pathname, item.url) ||
            isAnyChildActive(location.pathname, item.children);
        }
      });
    });

    return initialState;
  }, [location.pathname]);

  const [openMenus, setOpenMenus] =
    useState<Record<string, boolean>>(defaultOpenMenus);

  function toggleMenu(title: string) {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(29,78,216,0.18),rgba(220,38,38,0.14),rgba(15,23,42,0.94))] p-4 text-white shadow-[0_20px_50px_-24px_rgba(29,78,216,0.40)]">
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

          <SidebarTrigger className="mt-1 rounded-2xl border border-white/10 bg-card/80 shadow-sm hover:bg-card" />
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
                  const hasChildren = !!item.children?.length;
                  const itemActive = isRouteActive(location.pathname, item.url);
                  const childActive = isAnyChildActive(
                    location.pathname,
                    item.children,
                  );
                  const isExpanded = openMenus[item.title] || childActive;

                  if (hasChildren) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <button
                          type="button"
                          onClick={() => toggleMenu(item.title)}
                          className={cn(
                            "flex h-11 w-full items-center gap-2 rounded-2xl border px-3 text-sm transition-all duration-200",
                            itemActive || childActive
                              ? sidebarActiveItemClass
                              : "border-transparent hover:border-white/10 hover:bg-card/70",
                          )}
                        >
                          <Icon className="size-4 shrink-0" />
                          <span className="font-medium">{item.title}</span>

                          {isExpanded ? (
                            <ChevronDown className="ml-auto size-4 opacity-60" />
                          ) : (
                            <ChevronRight className="ml-auto size-4 opacity-40" />
                          )}
                        </button>

                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-200",
                            isExpanded ? "max-h-48 pt-2" : "max-h-0",
                          )}
                        >
                          <div className="ml-4 space-y-1 border-l border-white/10 pl-3">
                            {item.children?.map((child) => {
                              const childIsActive = isRouteActive(
                                location.pathname,
                                child.url,
                              );

                              return (
                                <NavLink
                                  key={child.title}
                                  to={child.url}
                                  className={cn(
                                    "flex h-10 items-center rounded-xl px-3 text-sm transition-all duration-200",
                                    childIsActive
                                      ? "border border-white/10 bg-white/10 text-foreground shadow-sm"
                                      : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
                                  )}
                                >
                                  <Receipt className="mr-2 size-3.5 shrink-0" />
                                  <span>{child.title}</span>
                                </NavLink>
                              );
                            })}
                          </div>
                        </div>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={itemActive}
                        className={cn(
                          "h-11 rounded-2xl border border-transparent transition-all duration-200",
                          itemActive
                            ? themeClasses.gradientSidebarActive
                            : "hover:border-white/10 hover:bg-card/70",
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
