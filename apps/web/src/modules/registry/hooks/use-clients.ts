import { useQuery } from "@tanstack/react-query";
import { getClients } from "../services/registry.service";

export function useClients() {
  return useQuery({
    queryKey: ["registry", "clients"],
    queryFn: getClients,
  });
}