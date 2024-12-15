export type Status = 'healthy' | 'degraded' | 'down';

export interface Metric {
  timestamp: string;
  interface_id: string;
  rtt_ms: number;
  latency_ms: number;
  jitter_ms: number;
  packet_loss: number;
  throughput_mbps: number;
  score: number;
  status: Status;
}
