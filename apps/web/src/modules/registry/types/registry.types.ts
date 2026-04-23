export type RegistryFormData = Record<string, string>;

export type RegistryColumn = {
  key: string;
  label: string;
};

export type RegistryRow = Record<string, string | number | null | undefined>;