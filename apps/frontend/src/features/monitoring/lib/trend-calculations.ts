import { NetworkInterface, Metric } from '@/features/monitoring/types';

export interface TrendSummary {
  metric: string;
  improving: number;
  declining: number;
  stable: number;
  avgChange: number;
}

export function calculateTrends(interfaces: NetworkInterface[], metrics: Metric[]): {
  score: TrendSummary;
  throughput: TrendSummary;
  latency: TrendSummary;
} {
  const scoreChanges: number[] = [];
  const throughputChanges: number[] = [];
  const latencyChanges: number[] = [];

  let scoreImproving = 0;
  let scoreDeclining = 0;
  let scoreStable = 0;
  let throughputImproving = 0;
  let throughputDeclining = 0;
  let throughputStable = 0;
  let latencyImproving = 0;
  let latencyDeclining = 0;
  let latencyStable = 0;

  for (const iface of interfaces) {
    const interfaceMetrics = metrics
      .filter((m) => m.interface_id === iface.id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (interfaceMetrics.length >= 2) {
      const first = interfaceMetrics[0];
      const last = interfaceMetrics[interfaceMetrics.length - 1];

      const scoreChange = last.score - first.score;
      const throughputChange = last.throughput_mbps - first.throughput_mbps;
      const latencyChange = last.latency_ms - first.latency_ms;

      scoreChanges.push(scoreChange);
      throughputChanges.push(throughputChange);
      latencyChanges.push(latencyChange);

      if (Math.abs(scoreChange) < 1) scoreStable++;
      else if (scoreChange > 0) scoreImproving++;
      else scoreDeclining++;

      if (Math.abs(throughputChange) < 1) throughputStable++;
      else if (throughputChange > 0) throughputImproving++;
      else throughputDeclining++;

      if (Math.abs(latencyChange) < 0.5) latencyStable++;
      else if (latencyChange < 0) latencyImproving++;
      else latencyDeclining++;
    }
  }

  const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  return {
    score: {
      metric: 'Score',
      improving: scoreImproving,
      declining: scoreDeclining,
      stable: scoreStable,
      avgChange: avg(scoreChanges),
    },
    throughput: {
      metric: 'Throughput',
      improving: throughputImproving,
      declining: throughputDeclining,
      stable: throughputStable,
      avgChange: avg(throughputChanges),
    },
    latency: {
      metric: 'Latency',
      improving: latencyImproving,
      declining: latencyDeclining,
      stable: latencyStable,
      avgChange: avg(latencyChanges),
    },
  };
}

