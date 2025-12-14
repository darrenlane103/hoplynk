import { Metric } from '../models/metric.model';

export const createMockMetric = (overrides?: Partial<Metric>): Metric => ({
  timestamp: '2024-01-01T00:00:00Z',
  interface_id: 'eth0',
  rtt_ms: 10,
  latency_ms: 5,
  jitter_ms: 2,
  packet_loss: 0,
  throughput_mbps: 100,
  score: 95,
  status: 'healthy',
  ...overrides,
});

export const createMockMetrics = (): Metric[] => {
  const interfaces = ['eth0', 'wlan0', 'lte0', 'starlink0'];
  const metrics: Metric[] = [];

  interfaces.forEach((interfaceId, index) => {
    for (let i = 0; i < 5; i++) {
      metrics.push(
        createMockMetric({
          timestamp: new Date(Date.now() - (4 - i) * 60000).toISOString(),
          interface_id: interfaceId,
          rtt_ms: 10 + index * 5 + i,
          latency_ms: 5 + index * 2 + i,
          score: 95 - index * 5 - i,
        })
      );
    }
  });

  return metrics;
};
