import { RegistryPage } from "../components/registry-page";
import { RegistryFormDialog } from "../components/registry-form-dialog";
import { useClients } from "../hooks/use-clients";
import { createEntity } from "../services/registry.service";
import { useQueryClient } from "@tanstack/react-query";

export function ClientsPage() {
  const query = useClients();
  const queryClient = useQueryClient();

  async function handleCreate(data: any) {
    await createEntity("/customers", data);
    queryClient.invalidateQueries({ queryKey: ["registry", "clients"] });
  }

  return (
    <RegistryPage
      title="Clientes"
      description="Gestão de clientes cadastrados"
      data={query.data ?? []}
      columns={[
        { key: "name", label: "Nome" },
        { key: "email", label: "Email" },
      ]}
      renderForm={() => (
        <RegistryFormDialog
          endpoint="/customers"
          onSubmit={handleCreate}
          fields={[
            { name: "name", label: "Nome" },
            { name: "email", label: "Email" },
          ]}
        />
      )}
    />
  );
}