import { useQueryClient } from "@tanstack/react-query";

import { RegistryFormDialog } from "../components/registry-form-dialog";
import { RegistryPage } from "../components/registry-page";
import { useBanks } from "../hooks/use-banks";
import { createEntity } from "../services/registry.service";
import type { RegistryFormData } from "../types/registry.types";

export function BanksPage() {
  const query = useBanks();
  const queryClient = useQueryClient();

  async function handleCreate(data: RegistryFormData) {
    await createEntity("/banks", data);
    await queryClient.invalidateQueries({
      queryKey: ["registry", "banks"],
    });
  }

  return (
    <RegistryPage
      title="Bancos"
      description="Gestão de bancos cadastrados"
      data={query.data ?? []}
      columns={[
        { key: "name", label: "Nome" },
        { key: "code", label: "Código" },
      ]}
      renderForm={() => (
        <RegistryFormDialog
          onSubmit={handleCreate}
          fields={[
            { name: "name", label: "Nome do banco" },
            { name: "code", label: "Código" },
          ]}
        />
      )}
    />
  );
}