import { Dataset } from '../models/dataset.model';
import { Device } from '../models/device.model';
import { NetworkInterface } from '../models/interface.model';
import { Metric } from '../models/metric.model';

function isDevice(obj: unknown): obj is Device {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const record = obj as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.location === 'string'
  );
}

function isNetworkInterface(obj: unknown): obj is NetworkInterface {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const record = obj as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.device_id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.link_type === 'string' &&
    ['ethernet', 'wifi', 'cellular', 'satellite'].includes(record.link_type as string) &&
    typeof record.provider === 'string' &&
    typeof record.priority === 'number'
  );
}

function isMetric(obj: unknown): obj is Metric {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const record = obj as Record<string, unknown>;
  return (
    typeof record.timestamp === 'string' &&
    typeof record.interface_id === 'string' &&
    typeof record.rtt_ms === 'number' &&
    typeof record.latency_ms === 'number' &&
    typeof record.jitter_ms === 'number' &&
    typeof record.packet_loss === 'number' &&
    typeof record.throughput_mbps === 'number' &&
    typeof record.score === 'number' &&
    typeof record.status === 'string' &&
    ['healthy', 'degraded', 'down'].includes(record.status as string)
  );
}

export function validateDataset(data: unknown): Dataset {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Dataset must be an object');
  }

  const dataset = data as Record<string, unknown>;

  if (!isDevice(dataset.device)) {
    throw new Error('Invalid device structure in dataset');
  }

  if (!Array.isArray(dataset.interfaces)) {
    throw new Error('Interfaces must be an array');
  }

  if (!dataset.interfaces.every(isNetworkInterface)) {
    throw new Error('Invalid interface structure in dataset');
  }

  if (!Array.isArray(dataset.metrics)) {
    throw new Error('Metrics must be an array');
  }

  if (!dataset.metrics.every(isMetric)) {
    throw new Error('Invalid metric structure in dataset');
  }

  return dataset as unknown as Dataset;
}
