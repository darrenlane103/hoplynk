export interface Device {
  id: string;
  name: string;
  location: string;
}

export type LinkType = 'ethernet' | 'wifi' | 'cellular' | 'satellite';

export interface NetworkInterface {
  id: string;
  device_id: string;
  name: string;
  link_type: LinkType;
  provider: string;
  priority: number;
}

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

