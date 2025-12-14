'use client';

import { useMemo } from 'react';
import { Metric } from '@/features/monitoring/types';
import { cn } from '@/lib/utils';

type ScoreSparklineProps = {
  metrics: Metric[];
  interfaceId: string;
  status: 'healthy' | 'degraded' | 'down';
  className?: string;
};

export function ScoreSparkline({
  metrics,
  interfaceId,
  status,
  className,
}: ScoreSparklineProps) {
  const data = useMemo(() => {
    const interfaceMetrics = metrics
      .filter((m) => m.interface_id === interfaceId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-20);

    if (interfaceMetrics.length < 2) return null;

    const values = interfaceMetrics.map((m) => m.throughput_mbps || 0);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);

    return {
      points: values.map((val, idx) => ({
        x: (idx / (values.length - 1 || 1)) * 100,
        y: max > min ? 100 - ((val - min) / (max - min)) * 100 : 50,
        value: val,
      })),
      hasData: values.some((v) => v > 0),
    };
  }, [metrics, interfaceId]);

  const statusColors = {
    healthy: '#22c55e',
    degraded: '#eab308',
    down: '#ef4444',
  };

  const statusColor = statusColors[status];

  if (!data || !data.hasData) {
    return (
      <div
        className={cn('h-3 w-full flex items-center justify-center', className)}
        aria-hidden="true"
      >
        <div className="h-px w-full bg-gray-200" />
      </div>
    );
  }

  const pathData = data.points
    .map((point, idx) => `${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaPath = `${pathData} L 100 100 L 0 100 Z`;

  return (
    <div
      className={cn('h-3 w-full relative', className)}
      role="img"
      aria-label={`Throughput trend for last 5 minutes`}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id={`gradient-${interfaceId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={statusColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={statusColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={areaPath}
          fill={`url(#gradient-${interfaceId})`}
          className="transition-all duration-200"
        />
        <path
          d={pathData}
          fill="none"
          stroke={statusColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-200"
        />
      </svg>
    </div>
  );
}
