import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "../services/registry.service";

export function useSuppliers() {
  return useQuery({
    queryKey: ["registry", "suppliers"],
    queryFn: getSuppliers,
  });
}