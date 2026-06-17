import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';
import { useAuthStore } from '@/stores/auth';

export function useDashboard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboard,
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
  });

  return {
    dashboard: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
  };
}
export default useDashboard;
