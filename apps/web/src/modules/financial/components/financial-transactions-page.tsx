import { useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FinancialType } from "../types/financial.types";
import { FinancialFormDialog } from "./financial-form-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { themeClasses } from "@/lib/theme-classes";
import type {
  FinancialKPIConfig,
  FinancialStatus,
  FinancialTotals,
  FinancialTransaction,
} from "../types/financial.types";
import { FinancialKPIGrid } from "./financial-kpi-grid";
import { FinancialStatusFilter } from "./financial-status-filter";
import { FinancialTransactionsTable } from "./financial-transactions-table";

function toNumber(value: number | string) {
  return typeof value === "number" ? value : Number(value);
}

type FinancialTransactionsPageProps = {
  badgeLabel: string;
  title: string;
  description: string;
  endpointLabel: string;
  loadingText: string;
  errorTitle: string;
  emptyText: string;
    transactionType: FinancialType;
  kpis: FinancialKPIConfig[];
  data: FinancialTransaction[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
};

export function FinancialTransactionsPage({
  badgeLabel,
  title,
  description,
  endpointLabel,
  loadingText,
  errorTitle,
  emptyText,
  transactionType,
  kpis,
  data,
  isLoading,
  isError,
  error,
}: FinancialTransactionsPageProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | FinancialStatus>(
    "ALL",
  );

  const filteredRows = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.account?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const totals = useMemo<FinancialTotals>(() => {
    const total = data.reduce((acc, item) => acc + toNumber(item.amount), 0);
    const paid = data
      .filter((item) => item.status === "PAID")
      .reduce((acc, item) => acc + toNumber(item.amount), 0);
    const pending = data
      .filter((item) => item.status === "PENDING")
      .reduce((acc, item) => acc + toNumber(item.amount), 0);
    const overdue = data
      .filter((item) => item.status === "OVERDUE")
      .reduce((acc, item) => acc + toNumber(item.amount), 0);

    return { total, paid, pending, overdue };
  }, [data]);

  if (isLoading) {
    return (
      <Card className={themeClasses.cardPremium}>
        <CardContent className="flex min-h-40 items-center justify-center text-muted-foreground">
          {loadingText}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-rose-500/20 bg-rose-500/5">
        <CardHeader>
          <CardTitle>{errorTitle}</CardTitle>
          <CardDescription>
            Verifique o backend e os headers de sessão de desenvolvimento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-rose-300">
            {error instanceof Error ? error.message : "Falha desconhecida"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section
        className={`relative overflow-hidden rounded-[28px] border border-white/10 p-8 ${themeClasses.gradientHero} ${themeClasses.cardHero}`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/10">
              {badgeLabel}
            </Badge>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-1 max-w-2xl text-sm text-white/75">
                {description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="rounded-2xl">
              <Download className="mr-2 size-4" />
              Exportar
            </Button>

            <div
              className={themeClasses.gradientSidebarActive + " rounded-2xl"}
            >
              <FinancialFormDialog
                type={transactionType}
                triggerLabel="Novo lançamento"
              />
            </div>
          </div>
        </div>
      </section>

      <FinancialKPIGrid totals={totals} kpis={kpis} />

      <Card className={themeClasses.cardPremium}>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Listagem operacional</CardTitle>
              <CardDescription>
                Dados reais vindos de <code>{endpointLabel}</code>
              </CardDescription>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative min-w-[280px]">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por título, categoria, conta ou ID"
                  className="rounded-2xl pl-9"
                />
              </div>

              <FinancialStatusFilter
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <FinancialTransactionsTable
            rows={filteredRows}
            emptyText={emptyText}
          />
        </CardContent>
      </Card>
    </div>
  );
}
