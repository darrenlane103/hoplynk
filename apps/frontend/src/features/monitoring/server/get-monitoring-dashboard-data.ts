import { getDevice, getInterfaces, getMetrics } from '@/server/api/monitoring';
import { Device, NetworkInterface, Metric } from '@/features/monitoring/types';

export interface MonitoringDashboardData {
  device: Device;
  interfaces: NetworkInterface[];
  metrics: Metric[];
}

export async function getMonitoringDashboardData(): Promise<MonitoringDashboardData> {
  const [device, interfaces, metrics] = await Promise.all([
    getDevice(),
    getInterfaces(),
    getMetrics(),
  ]);

  return {
    device,
    interfaces,
    metrics,
  };
}

