import { useQuery } from '@tanstack/react-query';
import { analyticsService, salesService } from '../services/api';

export function useKPIData() {
  const salesOverview = useQuery({
    queryKey: ['sales-overview'],
    queryFn: () => analyticsService.getSalesOverview().then(res => res.data),
  });
  const inventoryStatus = useQuery({
    queryKey: ['inventory-status'],
    queryFn: () => analyticsService.getInventoryStatus().then(res => res.data),
  });
  const customerInsights = useQuery({
    queryKey: ['customer-insights'],
    queryFn: () => analyticsService.getCustomerInsights().then(res => res.data),
  });
  const recentSales = useQuery({
    queryKey: ['recent-sales'],
    queryFn: () => salesService.getSales({ limit: 10 }).then(res => res.data),
  });

  const isLoading = salesOverview.isLoading || inventoryStatus.isLoading || customerInsights.isLoading;
  const isError = salesOverview.isError || inventoryStatus.isError || customerInsights.isError;

  return {
    salesOverview,
    inventoryStatus,
    customerInsights,
    recentSales,
    isLoading,
    isError,
  } as const;
}
