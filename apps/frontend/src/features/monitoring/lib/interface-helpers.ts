import { NetworkInterface, Metric, Status } from '@/features/monitoring/types';
import { getLatestMetricForInterface } from './metrics';

export function sortInterfacesByPriority(
  interfaces: NetworkInterface[],
  metrics: Metric[]
): NetworkInterface[] {
  const statusOrder: Record<Status, number> = {
    down: 0,
    degraded: 1,
    healthy: 2,
  };

  return [...interfaces].sort((a, b) => {
    const metricA = getLatestMetricForInterface(metrics, a.id);
    const metricB = getLatestMetricForInterface(metrics, b.id);

    if (!metricA && !metricB) return 0;
    if (!metricA) return 1;
    if (!metricB) return -1;

    const statusA = metricA.status;
    const statusB = metricB.status;

    if (statusA !== statusB) {
      return statusOrder[statusA] - statusOrder[statusB];
    }

    return metricA.score - metricB.score;
  });
}

export function getLatestMetricsMap(
  interfaces: NetworkInterface[],
  metrics: Metric[]
): Map<string, Metric> {
  const map = new Map<string, Metric>();
  for (const iface of interfaces) {
    const metric = getLatestMetricForInterface(metrics, iface.id);
    if (metric) {
      map.set(iface.id, metric);
    }
  }
  return map;
}

