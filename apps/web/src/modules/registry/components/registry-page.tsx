import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RegistryColumn = {
  key: string;
  label: string;
};

type RegistryRow = Record<string, string | number | null | undefined>;

type RegistryPageProps = {
  title: string;
  description: string;
  data: RegistryRow[];
  columns: RegistryColumn[];
  renderForm: () => React.ReactNode;
};

export function RegistryPage({
  title,
  description,
  data,
  columns,
  renderForm,
}: RegistryPageProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {renderForm()}
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="py-2 text-left">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-t">
                  {columns.map((col) => (
                    <td key={col.key} className="py-2">
                      {row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}