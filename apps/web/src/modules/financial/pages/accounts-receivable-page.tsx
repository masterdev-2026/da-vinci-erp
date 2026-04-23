import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
} from "lucide-react";

import { FinancialTransactionsPage } from "@/modules/financial/components/financial-transactions-page";
import { useReceivables } from "@/modules/financial/hooks/use-receivables";

export function AccountsReceivablePage() {
  const query = useReceivables();

  return (
    <FinancialTransactionsPage
      badgeLabel="Financeiro"
      title="Contas a Receber"
      description="Visão consolidada das receitas e valores a receber integrados ao backend."
      endpointLabel="/financial/receivables"
      loadingText="Carregando contas a receber..."
      errorTitle="Erro ao carregar contas a receber"
      emptyText="Nenhum lançamento encontrado."
      transactionType="INCOME"
      data={query.data ?? []}
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      kpis={[
        {
          title: "Carteira total",
          description: "Somatório de todos os recebíveis",
          icon: CircleDollarSign,
          valueKey: "total",
        },
        {
          title: "Pagos",
          description: "Receitas já liquidadas",
          icon: CheckCircle2,
          valueKey: "paid",
        },
        {
          title: "Pendentes",
          description: "Receitas aguardando pagamento",
          icon: Clock3,
          valueKey: "pending",
        },
        {
          title: "Vencidos",
          description: "Receitas em atraso",
          icon: AlertTriangle,
          valueKey: "overdue",
        },
      ]}
    />
  );
}