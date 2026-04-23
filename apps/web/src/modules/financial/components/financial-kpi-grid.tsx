import { Card, CardContent } from "@/components/ui/card";
import { themeClasses } from "@/lib/theme-classes";
import type {
  FinancialKPIConfig,
  FinancialTotals,
} from "../types/financial.types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function KPI({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card className={themeClasses.cardPremium}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-primary/10 p-3 text-primary">
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type FinancialKPIGridProps = {
  totals: FinancialTotals;
  kpis: FinancialKPIConfig[];
};

export function FinancialKPIGrid({
  totals,
  kpis,
}: FinancialKPIGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <KPI
          key={kpi.title}
          title={kpi.title}
          description={kpi.description}
          icon={kpi.icon}
          value={formatCurrency(totals[kpi.valueKey])}
        />
      ))}
    </section>
  );
}