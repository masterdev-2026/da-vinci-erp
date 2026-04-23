import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { RegistryFormData } from "../types/registry.types";

type RegistryField = {
  name: string;
  label: string;
};

type RegistryFormDialogProps = {
  fields: RegistryField[];
  onSubmit: (data: RegistryFormData) => Promise<void>;
};

export function RegistryFormDialog({
  fields,
  onSubmit,
}: RegistryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<RegistryFormData>({});

  function handleChange(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit(form);
    setOpen(false);
    setForm({});
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo cadastro</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <Input
              key={field.name}
              placeholder={field.label}
              value={form[field.name] ?? ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          ))}

          <Button type="submit">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}