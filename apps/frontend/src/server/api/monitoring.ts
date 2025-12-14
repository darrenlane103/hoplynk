import { Device, NetworkInterface, Metric } from '@/features/monitoring/types';
import { httpFetch } from '@/lib/http';

function getApiBaseUrl(): string {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    const error = 'API_URL or NEXT_PUBLIC_API_URL environment variable must be set';
    console.error(error);
    throw new Error(error);
  }

  try {
    new URL(apiUrl);
    return apiUrl;
  } catch {
    const error = `Invalid API URL: ${apiUrl}`;
    console.error(error);
    throw new Error(error);
  }
}

const API_BASE_URL = getApiBaseUrl();

export async function getDevice(): Promise<Device> {
  return httpFetch<Device>(`${API_BASE_URL}/device`);
}

export async function getInterfaces(): Promise<NetworkInterface[]> {
  return httpFetch<NetworkInterface[]>(`${API_BASE_URL}/interfaces`);
}

export async function getMetrics(): Promise<Metric[]> {
  return httpFetch<Metric[]>(`${API_BASE_URL}/metrics`);
}
