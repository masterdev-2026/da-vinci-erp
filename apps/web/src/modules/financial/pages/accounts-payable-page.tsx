import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CreditCard,
} from "lucide-react";

import { FinancialTransactionsPage } from "@/modules/financial/components/financial-transactions-page";
import { usePayables } from "@/modules/financial/hooks/use-payables";

export function AccountsPayablePage() {
  const query = usePayables();

  return (
    <FinancialTransactionsPage
      badgeLabel="Financeiro"
      title="Contas a Pagar"
      description="Visão consolidada das despesas e obrigações financeiras integradas ao backend."
      endpointLabel="/financial/payables"
      loadingText="Carregando contas a pagar..."
      errorTitle="Erro ao carregar contas a pagar"
      emptyText="Nenhuma obrigação encontrada."
      transactionType="EXPENSE"
      data={query.data ?? []}
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      kpis={[
        {
          title: "Obrigações totais",
          description: "Somatório de todas as contas a pagar",
          icon: CreditCard,
          valueKey: "total",
        },
        {
          title: "Pagas",
          description: "Despesas já liquidadas",
          icon: CheckCircle2,
          valueKey: "paid",
        },
        {
          title: "Pendentes",
          description: "Contas aguardando pagamento",
          icon: Clock3,
          valueKey: "pending",
        },
        {
          title: "Vencidas",
          description: "Contas em atraso",
          icon: AlertTriangle,
          valueKey: "overdue",
        },
      ]}
    />
  );
}