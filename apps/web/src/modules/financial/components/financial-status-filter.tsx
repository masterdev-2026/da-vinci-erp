import { Button } from "@/components/ui/button";
import type { FinancialStatus } from "../types/financial.types";

type FinancialStatusFilterProps = {
  value: "ALL" | FinancialStatus;
  onChange: (value: "ALL" | FinancialStatus) => void;
};

export function FinancialStatusFilter({
  value,
  onChange,
}: FinancialStatusFilterProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={value === "ALL" ? "default" : "outline"}
        className="rounded-2xl"
        onClick={() => onChange("ALL")}
      >
        Todos
      </Button>

      <Button
        variant={value === "PENDING" ? "default" : "outline"}
        className="rounded-2xl"
        onClick={() => onChange("PENDING")}
      >
        Pendentes
      </Button>

      <Button
        variant={value === "OVERDUE" ? "default" : "outline"}
        className="rounded-2xl"
        onClick={() => onChange("OVERDUE")}
      >
        Vencidos
      </Button>

      <Button
        variant={value === "PAID" ? "default" : "outline"}
        className="rounded-2xl"
        onClick={() => onChange("PAID")}
      >
        Pagos
      </Button>
    </div>
  );
}