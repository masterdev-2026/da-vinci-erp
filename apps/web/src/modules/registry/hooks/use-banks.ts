import { useQuery } from "@tanstack/react-query";
import { getBanks } from "../services/registry.service";

export function useBanks() {
  return useQuery({
    queryKey: ["registry", "banks"],
    queryFn: getBanks,
  });
}