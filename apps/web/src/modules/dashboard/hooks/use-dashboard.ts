import { useQuery } from "@tanstack/react-query";

import {
  getDashboardData,
  type DashboardData,
} from "@/modules/dashboard/services/dashboard.service";

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}