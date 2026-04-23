import { useQueryClient } from "@tanstack/react-query";

import { RegistryFormDialog } from "../components/registry-form-dialog";
import { RegistryPage } from "../components/registry-page";
import { useSuppliers } from "../hooks/use-suppliers";
import { createEntity } from "../services/registry.service";
import type { RegistryFormData } from "../types/registry.types";

export function SuppliersPage() {
  const query = useSuppliers();
  const queryClient = useQueryClient();

  async function handleCreate(data: RegistryFormData) {
    await createEntity("/suppliers", data);
    await queryClient.invalidateQueries({
      queryKey: ["registry", "suppliers"],
    });
  }

  return (
    <RegistryPage
      title="Fornecedores"
      description="Gestão de fornecedores cadastrados"
      data={query.data ?? []}
      columns={[
        { key: "name", label: "Nome" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Telefone" },
      ]}
      renderForm={() => (
        <RegistryFormDialog
          onSubmit={handleCreate}
          fields={[
            { name: "name", label: "Nome" },
            { name: "email", label: "Email" },
            { name: "phone", label: "Telefone" },
          ]}
        />
      )}
    />
  );
}