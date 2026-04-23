import { api } from "@/services/api";

export type DashboardCompany = {
  id: string;
  name: string;
  fantasyName?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type FinancialStatementItem = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  status: "PENDING" | "PAID" | string;
  dueDate: string;
  paidAt?: string | null;
  createdAt: string;
  category?: {
    id: string;
    name: string;
  } | null;
  account?: {
    id: string;
    name: string;
    balance?: number;
  } | null;
};

export type FleetDashboardResponse = {
  summary: {
    totalVehicles: number;
    totalFuel: number;
    totalMaintenance: number;
    totalFinesPending: number;
    avgConsumption: number;
  };
  vehicles: Array<{
    vehicleId: string;
    plate: string;
    totalCost: number;
    costPerKm: number;
  }>;
  ranking: Array<{
    vehicleId: string;
    plate: string;
    totalCost: number;
    costPerKm: number;
  }>;
  alerts: {
    highCostVehicles: Array<{
      vehicleId: string;
      plate: string;
      totalCost: number;
      costPerKm: number;
    }>;
    lowEfficiency: Array<{
      vehicleId: string;
      plate: string;
      totalCost: number;
      costPerKm: number;
    }>;
    pendingFines: boolean;
  };
};

export type HrDashboardResponse = {
  employees: {
    total: number;
    active: number;
    inactive: number;
  };
  vacationsInProgress: number;
  activeLeaves: number;
  payroll: {
    month: number;
    year: number;
    totalCost: number;
  };
  overtimeBalanceMinutes: number;
};

export type DashboardMetrics = {
  totalIncome: number;
  totalExpense: number;
  paidIncome: number;
  paidExpense: number;
  pendingIncome: number;
  pendingExpense: number;
  netBalance: number;
  transactionCount: number;
  paidCount: number;
  pendingCount: number;
};

export type RevenueSeriesItem = {
  month: string;
  entrada: number;
  saida: number;
};

export type DepartmentPerformanceItem = {
  name: string;
  value: number;
};

export type DashboardEvent = {
  id: string;
  title: string;
  description: string;
  status: "ok" | "warning" | "danger";
  createdAt: string;
};

export type DashboardAlert = {
  id: string;
  title: string;
  subtitle: string;
  severity: "info" | "warning" | "danger";
};

export type SnapshotItem = {
  label: string;
  value: string;
};

export type DashboardData = {
  companies: DashboardCompany[];
  statement: FinancialStatementItem[];
  receivables: FinancialStatementItem[];
  payables: FinancialStatementItem[];
  fleet: FleetDashboardResponse;
  hr: HrDashboardResponse;
  metrics: DashboardMetrics;
  revenueSeries: RevenueSeriesItem[];
  departmentPerformance: DepartmentPerformanceItem[];
  recentEvents: DashboardEvent[];
  alerts: DashboardAlert[];
  snapshots: SnapshotItem[];
};

const EMPTY_FLEET: FleetDashboardResponse = {
  summary: {
    totalVehicles: 0,
    totalFuel: 0,
    totalMaintenance: 0,
    totalFinesPending: 0,
    avgConsumption: 0,
  },
  vehicles: [],
  ranking: [],
  alerts: {
    highCostVehicles: [],
    lowEfficiency: [],
    pendingFines: false,
  },
};

const EMPTY_HR: HrDashboardResponse = {
  employees: {
    total: 0,
    active: 0,
    inactive: 0,
  },
  vacationsInProgress: 0,
  activeLeaves: 0,
  payroll: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalCost: 0,
  },
  overtimeBalanceMinutes: 0,
};

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function formatMonthLabel(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
  }).format(date);
}

function buildRevenueSeries(statement: FinancialStatementItem[]): RevenueSeriesItem[] {
  const ordered = [...statement].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const grouped = new Map<string, RevenueSeriesItem>();

  for (const item of ordered) {
    const key = new Date(item.createdAt).toISOString().slice(0, 7);
    const current = grouped.get(key) ?? {
      month: formatMonthLabel(item.createdAt),
      entrada: 0,
      saida: 0,
    };

    if (item.type === "INCOME") current.entrada += toNumber(item.amount);
    else current.saida += toNumber(item.amount);

    grouped.set(key, current);
  }

  return Array.from(grouped.values()).slice(-7);
}

function buildMetrics(statement: FinancialStatementItem[]): DashboardMetrics {
  let totalIncome = 0;
  let totalExpense = 0;
  let paidIncome = 0;
  let paidExpense = 0;
  let pendingIncome = 0;
  let pendingExpense = 0;
  let paidCount = 0;
  let pendingCount = 0;

  for (const item of statement) {
    const amount = toNumber(item.amount);
    const isPaid = item.status === "PAID";

    if (item.type === "INCOME") {
      totalIncome += amount;
      if (isPaid) paidIncome += amount;
      else pendingIncome += amount;
    } else {
      totalExpense += amount;
      if (isPaid) paidExpense += amount;
      else pendingExpense += amount;
    }

    if (isPaid) paidCount += 1;
    else pendingCount += 1;
  }

  return {
    totalIncome,
    totalExpense,
    paidIncome,
    paidExpense,
    pendingIncome,
    pendingExpense,
    netBalance: totalIncome - totalExpense,
    transactionCount: statement.length,
    paidCount,
    pendingCount,
  };
}

function buildDepartmentPerformance(
  fleet: FleetDashboardResponse,
  hr: HrDashboardResponse,
  metrics: DashboardMetrics,
): DepartmentPerformanceItem[] {
  const financeScore =
    metrics.totalIncome > 0
      ? Math.min(100, Math.round((metrics.paidIncome / metrics.totalIncome) * 100))
      : 0;

  const fleetScore =
    fleet.summary.totalVehicles > 0
      ? Math.max(
          0,
          Math.min(
            100,
            100 -
              fleet.alerts.highCostVehicles.length * 10 -
              fleet.alerts.lowEfficiency.length * 8 -
              (fleet.alerts.pendingFines ? 12 : 0),
          ),
        )
      : 0;

  const hrScore =
    hr.employees.total > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(
              (hr.employees.active / hr.employees.total) * 100 -
                hr.activeLeaves * 2 -
                hr.vacationsInProgress,
            ),
          ),
        )
      : 0;

  return [
    { name: "Financeiro", value: financeScore },
    { name: "Frota", value: fleetScore || 0 },
    { name: "RH", value: hrScore || 0 },
    { name: "Cadastros", value: 82 },
  ];
}

function buildRecentEvents(statement: FinancialStatementItem[]): DashboardEvent[] {
  return statement.slice(0, 5).map((item) => ({
    id: item.id,
    title: item.type === "INCOME" ? `Recebimento: ${item.title}` : `Despesa: ${item.title}`,
    description: [item.category?.name, item.account?.name].filter(Boolean).join(" • "),
    status:
      item.status === "PAID"
        ? "ok"
        : item.type === "EXPENSE"
          ? "warning"
          : "danger",
    createdAt: item.createdAt,
  }));
}

function buildAlerts(
  payables: FinancialStatementItem[],
  receivables: FinancialStatementItem[],
  fleet: FleetDashboardResponse,
  hr: HrDashboardResponse,
): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];

  const overduePayables = payables.filter(
    (item) => item.status !== "PAID" && new Date(item.dueDate).getTime() < Date.now(),
  );

  const overdueReceivables = receivables.filter(
    (item) => item.status !== "PAID" && new Date(item.dueDate).getTime() < Date.now(),
  );

  if (overduePayables.length > 0) {
    alerts.push({
      id: "overdue-payables",
      title: `${overduePayables.length} contas a pagar vencidas`,
      subtitle: "Necessário revisar pendências financeiras imediatas.",
      severity: "danger",
    });
  }

  if (overdueReceivables.length > 0) {
    alerts.push({
      id: "overdue-receivables",
      title: `${overdueReceivables.length} contas a receber em atraso`,
      subtitle: "Existe impacto potencial no fluxo de caixa projetado.",
      severity: "warning",
    });
  }

  if (fleet.alerts.pendingFines) {
    alerts.push({
      id: "fleet-fines",
      title: "Multas pendentes na frota",
      subtitle: "Há valores pendentes que exigem acompanhamento operacional.",
      severity: "warning",
    });
  }

  if (hr.activeLeaves > 0) {
    alerts.push({
      id: "hr-leaves",
      title: `${hr.activeLeaves} afastamentos ativos`,
      subtitle: "Acompanhe impactos de escala e cobertura de equipe.",
      severity: "info",
    });
  }

  return alerts.slice(0, 4);
}

function buildSnapshots(
  companies: DashboardCompany[],
  fleet: FleetDashboardResponse,
  hr: HrDashboardResponse,
): SnapshotItem[] {
  return [
    { label: "Empresas ativas", value: String(companies.length) },
    { label: "Veículos ativos", value: String(fleet.summary.totalVehicles) },
    { label: "Colaboradores", value: String(hr.employees.total) },
  ];
}

async function safeGet<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await api.get<T>(url);
    return response.data;
  } catch (error) {
    console.error(`Erro ao carregar ${url}`, error);
    return fallback;
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const [companies, statement, receivables, payables, fleet, hr] =
    await Promise.all([
      safeGet<DashboardCompany[]>("/companies", []),
      safeGet<FinancialStatementItem[]>("/financial/statement", []),
      safeGet<FinancialStatementItem[]>("/financial/receivables", []),
      safeGet<FinancialStatementItem[]>("/financial/payables", []),
      safeGet<FleetDashboardResponse>("/fleet/dashboard", EMPTY_FLEET),
      safeGet<HrDashboardResponse>("/hr-dashboard", EMPTY_HR),
    ]);

  const metrics = buildMetrics(statement);
  const revenueSeries = buildRevenueSeries(statement);
  const departmentPerformance = buildDepartmentPerformance(fleet, hr, metrics);
  const recentEvents = buildRecentEvents(statement);
  const alerts = buildAlerts(payables, receivables, fleet, hr);
  const snapshots = buildSnapshots(companies, fleet, hr);

  return {
    companies,
    statement,
    receivables,
    payables,
    fleet,
    hr,
    metrics,
    revenueSeries,
    departmentPerformance,
    recentEvents,
    alerts,
    snapshots,
  };
}