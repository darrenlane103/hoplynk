import { NetworkInterface, Metric } from '@/features/monitoring/types';
import { formatLinkType } from './metrics';

export function getLatestMetricsByInterface(metrics: Metric[]): Map<string, Metric> {
  const latestMap = new Map<string, Metric>();

  for (const metric of metrics) {
    const existing = latestMap.get(metric.interface_id);
    if (!existing || new Date(metric.timestamp) > new Date(existing.timestamp)) {
      latestMap.set(metric.interface_id, metric);
    }
  }

  return latestMap;
}

export function getBestLink(
  interfaces: NetworkInterface[],
  metrics: Metric[]
): { name: string; score: number; linkType: string } | null {
  const latestMetrics = getLatestMetricsByInterface(metrics);
  let bestLink: { id: string; score: number } | null = null;

  for (const iface of interfaces) {
    const metric = latestMetrics.get(iface.id);
    if (metric) {
      if (!bestLink || metric.score > bestLink.score) {
        bestLink = { id: iface.id, score: metric.score };
      }
    }
  }

  if (!bestLink) return null;

  const iface = interfaces.find((i) => i.id === bestLink!.id);
  if (!iface) return null;

  return { name: iface.name, score: bestLink.score, linkType: formatLinkType(iface.link_type) };
}

export function getWorstLink(
  interfaces: NetworkInterface[],
  metrics: Metric[]
): { name: string; score: number; linkType: string } | null {
  const latestMetrics = getLatestMetricsByInterface(metrics);
  let worstLink: { id: string; score: number } | null = null;

  for (const iface of interfaces) {
    const metric = latestMetrics.get(iface.id);
    if (metric) {
      if (!worstLink || metric.score < worstLink.score) {
        worstLink = { id: iface.id, score: metric.score };
      }
    }
  }

  if (!worstLink) return null;

  const iface = interfaces.find((i) => i.id === worstLink!.id);
  if (!iface) return null;

  return { name: iface.name, score: worstLink.score, linkType: formatLinkType(iface.link_type) };
}

export function getAverageRTT(interfaces: NetworkInterface[], metrics: Metric[]): number {
  const latestMetrics = getLatestMetricsByInterface(metrics);
  let totalRTT = 0;
  let count = 0;

  for (const iface of interfaces) {
    const metric = latestMetrics.get(iface.id);
    if (metric) {
      totalRTT += metric.rtt_ms;
      count++;
    }
  }

  return count > 0 ? Math.round(totalRTT / count) : 0;
}

export function getAverageThroughput(interfaces: NetworkInterface[], metrics: Metric[]): number {
  const latestMetrics = getLatestMetricsByInterface(metrics);
  let totalThroughput = 0;
  let count = 0;

  for (const iface of interfaces) {
    const metric = latestMetrics.get(iface.id);
    if (metric) {
      totalThroughput += metric.throughput_mbps;
      count++;
    }
  }

  return count > 0 ? Math.round(totalThroughput / count) : 0;
}

export function getAverageDelta(
  interfaces: NetworkInterface[],
  metrics: Metric[],
  metricType: 'rtt' | 'throughput'
): { value: number; isPositive: boolean } | null {
  const interfaceMetrics = interfaces
    .map((iface) => {
      const ifaceMetrics = metrics
        .filter((m) => m.interface_id === iface.id)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      if (ifaceMetrics.length < 2) return null;

      const first = ifaceMetrics[0];
      const last = ifaceMetrics[ifaceMetrics.length - 1];

      if (metricType === 'rtt') {
        return last.rtt_ms - first.rtt_ms;
      } else {
        return last.throughput_mbps - first.throughput_mbps;
      }
    })
    .filter((v): v is number => v !== null);

  if (interfaceMetrics.length === 0) return null;

  const avgDelta = interfaceMetrics.reduce((a, b) => a + b, 0) / interfaceMetrics.length;
  return { value: Math.abs(avgDelta), isPositive: avgDelta > 0 };
}

