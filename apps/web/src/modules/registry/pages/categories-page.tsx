import { useQueryClient } from "@tanstack/react-query";

import { RegistryFormDialog } from "../components/registry-form-dialog";
import { RegistryPage } from "../components/registry-page";
import { useCategories } from "../hooks/use-categories";
import { createEntity } from "../services/registry.service";
import type { RegistryFormData } from "../types/registry.types";

export function CategoriesPage() {
  const query = useCategories();
  const queryClient = useQueryClient();

  async function handleCreate(data: RegistryFormData) {
    await createEntity("/categories", data);
    await queryClient.invalidateQueries({
      queryKey: ["registry", "categories"],
    });
  }

  return (
    <RegistryPage
      title="Categorias"
      description="Gestão de categorias cadastradas"
      data={query.data ?? []}
      columns={[
        { key: "name", label: "Nome" },
        { key: "type", label: "Tipo" },
      ]}
      renderForm={() => (
        <RegistryFormDialog
          onSubmit={handleCreate}
          fields={[
            { name: "name", label: "Nome da categoria" },
            { name: "type", label: "Tipo (INCOME ou EXPENSE)" },
          ]}
        />
      )}
    />
  );
}