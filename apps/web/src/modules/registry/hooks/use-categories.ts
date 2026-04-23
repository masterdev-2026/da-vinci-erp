import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/registry.service";

export function useCategories() {
  return useQuery({
    queryKey: ["registry", "categories"],
    queryFn: getCategories,
  });
}