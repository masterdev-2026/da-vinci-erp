import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  Clock3,
  FileWarning,
  Loader2,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { themeClasses } from "@/lib/theme-classes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/modules/dashboard/hooks/use-dashboard";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatMonthYear(month: number, year: number) {
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function KpiCard({
  title,
  value,
  delta,
  positive,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  delta: string;
  positive: boolean;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <Card className={`${themeClasses.cardPremium} overflow-hidden`}>
      <CardHeader className="pb-4">
        <CardDescription className="text-xs uppercase tracking-[0.16em]">
          {title}
        </CardDescription>

        <CardAction>
          <div className="rounded-2xl border border-white/10 bg-primary/10 p-2.5 text-primary">
            <Icon className="size-4" />
          </div>
        </CardAction>

        <CardTitle className="text-3xl font-semibold tracking-tight">
          {value}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">{subtitle}</p>

        <div
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            positive
              ? "bg-emerald-500/12 text-emerald-400"
              : "bg-rose-500/12 text-rose-400"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="size-3.5" />
          ) : (
            <ArrowDownRight className="size-3.5" />
          )}
          {delta}
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Card className={themeClasses.cardPremium}>
        <CardContent className="flex min-h-48 items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Carregando indicadores do dashboard...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardError({ message }: { message: string }) {
  return (
    <Card className="border-rose-500/20 bg-rose-500/5">
      <CardHeader>
        <CardTitle>Erro ao carregar dashboard</CardTitle>
        <CardDescription>
          Verifique se o backend está rodando e se os headers de autenticação de
          desenvolvimento estão corretos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-rose-300">{message}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) return <DashboardLoading />;

  if (isError || !data) {
    return (
      <DashboardError
        message={error instanceof Error ? error.message : "Falha desconhecida"}
      />
    );
  }

  const healthItems = [
    {
      title: "A receber",
      value: formatCurrency(data.metrics.pendingIncome),
      change: `${data.receivables.length} registros`,
    },
    {
      title: "A pagar",
      value: formatCurrency(data.metrics.pendingExpense),
      change: `${data.payables.length} registros`,
    },
    {
      title: "Saldo projetado",
      value: formatCurrency(data.metrics.pendingIncome - data.metrics.pendingExpense),
      change: `${data.metrics.pendingCount} pendências`,
    },
  ];

  const kpis = [
    {
      title: "Receita consolidada",
      value: formatCompactCurrency(data.metrics.totalIncome),
      delta: `${data.metrics.paidCount} pagos`,
      positive: true,
      subtitle: "Receitas acumuladas no extrato geral.",
      icon: CircleDollarSign,
    },
    {
      title: "Custos operacionais",
      value: formatCompactCurrency(data.metrics.totalExpense),
      delta: `${data.payables.length} despesas`,
      positive: false,
      subtitle: "Despesas acumuladas no extrato geral.",
      icon: Truck,
    },
    {
      title: "Contratos / Empresas",
      value: String(data.companies.length),
      delta: "empresas",
      positive: true,
      subtitle: "Empresas disponíveis para operação.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Colaboradores",
      value: String(data.hr.employees.total),
      delta: `${data.hr.employees.active} ativos`,
      positive: true,
      subtitle: "Total atual de colaboradores cadastrados.",
      icon: Users,
    },
  ];

  const snapshotMap: Record<string, React.ElementType> = {
    "Empresas ativas": Building2,
    "Veículos ativos": Truck,
    Colaboradores: Clock3,
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Card
  className={`relative overflow-hidden border-white/10 ${themeClasses.gradientHero} ${themeClasses.cardHero}`}
>
          <div className="absolute top-0 right-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />

          <CardHeader className="relative z-10 gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
              <BadgeCheck className="size-3.5" />
              Plataforma operacional ativa
            </div>

            <CardTitle className="text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
              Painel executivo do Da Vinci ERP
            </CardTitle>

            <CardDescription className="max-w-2xl text-sm leading-7 text-white/70 md:text-base">
              Dashboard conectado ao backend real com visão consolidada de
              finanças, frota, RH e operação.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Empresas monitoradas
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex -space-x-3">
                  {data.companies.slice(0, 3).map((company) => (
                    <Avatar
                      key={company.id}
                      className="border-2 border-slate-900"
                    >
                      <AvatarFallback>
                        {(company.fantasyName ?? company.name)
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>

                <span className="text-sm text-white/70">
                  {data.companies.length} empresa(s) disponíveis no ambiente
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button className="rounded-2xl bg-white text-slate-900 hover:bg-white/90">
                Abrir centro financeiro
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-white/15 bg-white/8 text-white hover:bg-white/10"
              >
                Atualizar visão
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className={themeClasses.cardPremium}>
          <CardHeader>
            <CardDescription>Status rápido</CardDescription>
            <CardTitle className="text-2xl font-semibold">
              Saúde operacional
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {healthItems.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-white/10 bg-background/40 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{item.title}</p>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {item.change}
                  </span>
                </div>
                <p className="text-2xl font-semibold tracking-tight">
                  {item.value}
                </p>
              </div>
            ))}

            <div className="rounded-[22px] border border-emerald-500/20 bg-emerald-500/8 p-4">
              <div className="mb-2 flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="size-4" />
                <span className="text-sm font-semibold">Compliance em dia</span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Folha de {formatMonthYear(data.hr.payroll.month, data.hr.payroll.year)} com
                custo líquido de {` ${formatCurrency(data.hr.payroll.totalCost)}`}.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className={themeClasses.cardPremium}>
          <CardHeader className="border-b border-white/10">
            <CardDescription>Fluxo financeiro</CardDescription>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Entradas x saídas
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="mb-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-[22px] border border-emerald-500/15 bg-emerald-500/7 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-emerald-400">
                  Entradas
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {formatCurrency(data.metrics.totalIncome)}
                </p>
              </div>

              <div className="rounded-[22px] border border-amber-500/15 bg-amber-500/7 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-amber-400">
                  Saídas
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {formatCurrency(data.metrics.totalExpense)}
                </p>
              </div>

              <div className="rounded-[22px] border border-primary/15 bg-primary/7 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-primary">
                  Resultado
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {formatCurrency(data.metrics.netBalance)}
                </p>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueSeries}>
                  <defs>
                    <linearGradient id="entradaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="saidaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.14)" />
                  <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(15,23,42,0.92)",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="entrada"
                    stroke="#10b981"
                    fill="url(#entradaFill)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="saida"
                    stroke="#6366f1"
                    fill="url(#saidaFill)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={themeClasses.cardPremium}>
          <CardHeader className="border-b border-white/10">
            <CardDescription>Desempenho por área</CardDescription>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Eficiência operacional
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.departmentPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                  <XAxis type="number" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(15,23,42,0.92)",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                    {data.departmentPerformance.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          entry.name === "Financeiro"
                            ? "#6366f1"
                            : entry.name === "Frota"
                              ? "#f59e0b"
                              : entry.name === "RH"
                                ? "#ec4899"
                                : "#10b981"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr_0.9fr]">
        <Card className={themeClasses.cardPremium}>
          <CardHeader className="border-b border-white/10">
            <CardDescription>Alertas prioritários</CardDescription>
            <CardTitle className="text-xl font-semibold">
              Itens que precisam de atenção
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 pt-6">
            {data.alerts.length === 0 ? (
              <div className="rounded-[22px] border border-emerald-500/20 bg-emerald-500/8 p-4 text-sm text-muted-foreground">
                Nenhum alerta prioritário no momento.
              </div>
            ) : (
              data.alerts.map((item) => {
                const Icon =
                  item.severity === "danger"
                    ? FileWarning
                    : item.severity === "warning"
                      ? AlertTriangle
                      : Users;

                const tone =
                  item.severity === "danger"
                    ? "text-rose-400 bg-rose-500/10 border-rose-500/15"
                    : item.severity === "warning"
                      ? "text-amber-400 bg-amber-500/10 border-amber-500/15"
                      : "text-primary bg-primary/10 border-primary/15";

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-background/35 p-4"
                  >
                    <div className={`rounded-2xl border p-2.5 ${tone}`}>
                      <Icon className="size-4" />
                    </div>

                    <div className="space-y-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className={themeClasses.cardPremium}>
          <CardHeader className="border-b border-white/10">
            <CardDescription>Atividade recente</CardDescription>
            <CardTitle className="text-xl font-semibold">
              Linha do tempo operacional
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            {data.recentEvents.map((event) => {
              const Icon =
                event.status === "danger"
                  ? FileWarning
                  : event.status === "warning"
                    ? Truck
                    : CircleDollarSign;

              const tone =
                event.status === "danger"
                  ? "bg-rose-500/10 text-rose-400"
                  : event.status === "warning"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-emerald-500/10 text-emerald-400";

              return (
                <div key={event.id} className="flex gap-3">
                  <div className={`mt-0.5 rounded-2xl p-2.5 ${tone}`}>
                    <Icon className="size-4" />
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.description || "Sem detalhes adicionais"}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className={themeClasses.cardPremium}>
          <CardHeader className="border-b border-white/10">
            <CardDescription>Resumo administrativo</CardDescription>
            <CardTitle className="text-xl font-semibold">
              Snapshot do ambiente
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            {data.snapshots.map((item) => {
              const Icon = snapshotMap[item.label] ?? Building2;

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-[22px] border border-white/10 bg-background/35 px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-white/10 bg-primary/10 p-2.5 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>

                  <span className="text-xl font-semibold">{item.value}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}