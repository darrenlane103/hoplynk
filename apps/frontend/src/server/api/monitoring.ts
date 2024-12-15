import { Device, NetworkInterface, Metric } from '@/features/monitoring/types';
import { httpFetch } from '@/lib/http';
import { env } from '@/lib/env';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

export async function getDevice(): Promise<Device> {
  return httpFetch<Device>(`${API_BASE_URL}/device`);
}

export async function getInterfaces(): Promise<NetworkInterface[]> {
  return httpFetch<NetworkInterface[]>(`${API_BASE_URL}/interfaces`);
}

export async function getMetrics(): Promise<Metric[]> {
  return httpFetch<Metric[]>(`${API_BASE_URL}/metrics`);
}
