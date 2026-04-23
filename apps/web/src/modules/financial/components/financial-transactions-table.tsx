import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { themeClasses } from "@/lib/theme-classes";
import type {
  FinancialStatus,
  FinancialTransaction,
} from "../types/financial.types";

function toNumber(value: number | string) {
  return typeof value === "number" ? value : Number(value);
}

function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(toNumber(value));
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

function getStatusLabel(status: FinancialStatus) {
  switch (status) {
    case "PAID":
      return "Pago";
    case "OVERDUE":
      return "Vencido";
    default:
      return "Pendente";
  }
}

function getStatusClass(status: FinancialStatus) {
  switch (status) {
    case "PAID":
      return themeClasses.badgeSuccess;
    case "OVERDUE":
      return themeClasses.badgeDanger;
    default:
      return themeClasses.badgeWarning;
  }
}

type FinancialTransactionsTableProps = {
  rows: FinancialTransaction[];
  emptyText: string;
};

export function FinancialTransactionsTable({
  rows,
  emptyText,
}: FinancialTransactionsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr className="text-left">
            <th className="px-4 py-3 font-medium">Título</th>
            <th className="px-4 py-3 font-medium">Categoria</th>
            <th className="px-4 py-3 font-medium">Conta</th>
            <th className="px-4 py-3 font-medium">Vencimento</th>
            <th className="px-4 py-3 font-medium">Pagamento</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Valor</th>
            <th className="px-4 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-white/10">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium">{row.title}</p>
                  <p className="text-xs text-muted-foreground">{row.id}</p>
                </div>
              </td>

              <td className="px-4 py-3">{row.category?.name ?? "-"}</td>
              <td className="px-4 py-3">{row.account?.name ?? "-"}</td>
              <td className="px-4 py-3">{formatDate(row.dueDate)}</td>
              <td className="px-4 py-3">{formatDate(row.paidAt)}</td>
              <td className="px-4 py-3">
                <Badge className={getStatusClass(row.status)}>
                  {getStatusLabel(row.status)}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right font-medium">
                {formatCurrency(row.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="rounded-2xl">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                    <DropdownMenuItem>Editar lançamento</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-10 text-center text-muted-foreground"
              >
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}