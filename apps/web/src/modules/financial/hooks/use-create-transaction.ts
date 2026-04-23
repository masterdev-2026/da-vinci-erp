import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFinancialTransaction } from "../services/financial.service";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFinancialTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "receivables"] });
      queryClient.invalidateQueries({ queryKey: ["financial", "payables"] });
    },
  });
}