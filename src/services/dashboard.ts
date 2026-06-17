import { api } from '@/lib/axios';
import { DashboardResponse } from '@/types/api';

export const dashboardService = {
  async getDashboard(): Promise<DashboardResponse> {
    const { data } = await api.get<DashboardResponse>('/dashboard/');
    return data;
  },
};
