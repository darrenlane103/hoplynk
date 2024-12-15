import { useMemo } from 'react';
import { NetworkInterface, Metric } from '@/features/monitoring/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateTrends } from '@/features/monitoring/lib/trend-calculations';
import { getTrendColorForValue } from '@/features/monitoring/lib/trend-helpers';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

type CompactTrendSummaryProps = {
  interfaces: NetworkInterface[];
  metrics: Metric[];
};

function TrendIcon({ value, isLowerBetter = false }: { value: number; isLowerBetter?: boolean }) {
  const color = getTrendColorForValue(value, isLowerBetter);
  const adjustedValue = isLowerBetter ? -value : value;
  
  if (Math.abs(adjustedValue) < 0.1) {
    return <Minus className={`h-4 w-4 ${color}`} />;
  }
  
  if (adjustedValue > 0) {
    return <ArrowUp className={`h-4 w-4 ${color}`} />;
  }
  
  return <ArrowDown className={`h-4 w-4 ${color}`} />;
}

export function CompactTrendSummary({ interfaces, metrics }: CompactTrendSummaryProps) {
  const trends = useMemo(
    () => calculateTrends(interfaces, metrics),
    [interfaces, metrics]
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Trends</CardTitle>
        <CardDescription className="text-xs">5-min change</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Score</span>
                <TrendIcon value={trends.score.avgChange} />
              </div>
              <div className="text-right">
                {Math.abs(trends.score.avgChange) < 0.1 ? (
                  <span className="text-sm font-semibold text-gray-400">No change</span>
                ) : (
                  <span className={`text-sm font-bold ${getTrendColorForValue(trends.score.avgChange)}`}>
                    {trends.score.avgChange > 0 ? '+' : ''}{trends.score.avgChange.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
            {Math.abs(trends.score.avgChange) >= 0.1 && (
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    getTrendColorForValue(trends.score.avgChange) === 'text-green-600' ? 'bg-green-600' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.abs(trends.score.avgChange) * 10)}%` }}
                />
              </div>
            )}
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Throughput</span>
                <TrendIcon value={trends.throughput.avgChange} />
              </div>
              <div className="text-right">
                {Math.abs(trends.throughput.avgChange) < 0.1 ? (
                  <span className="text-sm font-semibold text-gray-400">No change</span>
                ) : (
                  <span className={`text-sm font-bold ${getTrendColorForValue(trends.throughput.avgChange)}`}>
                    {trends.throughput.avgChange > 0 ? '+' : ''}{trends.throughput.avgChange.toFixed(1)} Mbps
                  </span>
                )}
              </div>
            </div>
            {Math.abs(trends.throughput.avgChange) >= 0.1 && (
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    getTrendColorForValue(trends.throughput.avgChange) === 'text-green-600' ? 'bg-green-600' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.abs(trends.throughput.avgChange) / 2)}%` }}
                />
              </div>
            )}
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Latency</span>
                <TrendIcon value={trends.latency.avgChange} isLowerBetter />
              </div>
              <div className="text-right">
                {Math.abs(trends.latency.avgChange) < 0.1 ? (
                  <span className="text-sm font-semibold text-gray-400">No change</span>
                ) : (
                  <span className={`text-sm font-bold ${getTrendColorForValue(trends.latency.avgChange, true)}`}>
                    {trends.latency.avgChange > 0 ? '+' : ''}{trends.latency.avgChange.toFixed(1)} ms
                  </span>
                )}
              </div>
            </div>
            {Math.abs(trends.latency.avgChange) >= 0.1 && (
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    getTrendColorForValue(trends.latency.avgChange, true) === 'text-green-600' ? 'bg-green-600' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.abs(trends.latency.avgChange) / 2)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

