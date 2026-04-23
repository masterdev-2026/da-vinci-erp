import { useMemo, useState } from "react";
import type { FinancialType } from "../types/financial.types";
import { useAccounts } from "../hooks/use-accounts";
import { useCategories } from "../hooks/use-categories";
import { useCreateTransaction } from "../hooks/use-create-transaction"; 

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type FinancialFormDialogProps = {
  type: FinancialType;
  triggerLabel?: string;
};

export function FinancialFormDialog({
  type,
  triggerLabel = "Novo lançamento",
}: FinancialFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"PENDING" | "PAID" | "OVERDUE">("PENDING");
  const [dueDate, setDueDate] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");

  const accountsQuery = useAccounts();
  const categoriesQuery = useCategories();
  const createMutation = useCreateTransaction();

  const filteredCategories = useMemo(() => {
    return (categoriesQuery.data ?? []).filter((item) => item.type === type);
  }, [categoriesQuery.data, type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createMutation.mutateAsync({
      title,
      amount: Number(amount),
      type,
      status,
      dueDate: new Date(dueDate).toISOString(),
      paidAt: paidAt ? new Date(paidAt).toISOString() : null,
      categoryId,
      accountId,
    });

    setOpen(false);
    setTitle("");
    setAmount("");
    setStatus("PENDING");
    setDueDate("");
    setPaidAt("");
    setCategoryId("");
    setAccountId("");
  }

  const titleText =
    type === "INCOME" ? "Novo lançamento a receber" : "Novo lançamento a pagar";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription>
            Preencha os dados do lançamento financeiro.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Mensalidade Cliente XPTO"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="PAID">Pago</SelectItem>
                <SelectItem value="OVERDUE">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate">Data de vencimento</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paidAt">Data de pagamento</Label>
            <Input
              id="paidAt"
              type="date"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Conta</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a conta" />
              </SelectTrigger>
              <SelectContent>
                {(accountsQuery.data ?? []).map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Salvando..." : "Salvar lançamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}