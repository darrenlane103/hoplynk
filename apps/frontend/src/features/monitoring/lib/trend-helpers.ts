import { Metric } from '@/features/monitoring/types';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export type Trend = 'up' | 'down' | 'stable';

export function calculateTrend(metrics: Metric[], interfaceId: string): Trend {
  const interfaceMetrics = metrics
    .filter((m) => m.interface_id === interfaceId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (interfaceMetrics.length < 2) return 'stable';

  const first = interfaceMetrics[0];
  const last = interfaceMetrics[interfaceMetrics.length - 1];
  const diff = last.score - first.score;
  const threshold = 2;

  if (diff > threshold) return 'up';
  if (diff < -threshold) return 'down';
  return 'stable';
}

export function getTrendIcon(trend: Trend) {
  switch (trend) {
    case 'up':
      return ArrowUp;
    case 'down':
      return ArrowDown;
    default:
      return Minus;
  }
}

export function getTrendColor(trend: Trend): string {
  switch (trend) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    default:
      return 'text-gray-400';
  }
}

export function getTrendIconForValue(value: number) {
  if (Math.abs(value) < 0.1) return Minus;
  return value > 0 ? ArrowUp : ArrowDown;
}

export function getTrendColorForValue(value: number, isLowerBetter = false): string {
  if (Math.abs(value) < 0.1) return 'text-gray-400';
  const isGood = isLowerBetter ? value < 0 : value > 0;
  return isGood ? 'text-green-600' : 'text-red-600';
}

