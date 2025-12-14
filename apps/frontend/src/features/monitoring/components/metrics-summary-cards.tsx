import { NetworkInterface, Metric } from '@/features/monitoring/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  getBestLink,
  getWorstLink,
  getAverageRTT,
  getAverageThroughput,
  getAverageDelta,
} from '@/features/monitoring/lib/metric-aggregation';

type MetricsSummaryCardsProps = {
  interfaces: NetworkInterface[];
  metrics: Metric[];
};

export function MetricsSummaryCards({ interfaces, metrics }: MetricsSummaryCardsProps) {
  const bestLink = getBestLink(interfaces, metrics);
  const worstLink = getWorstLink(interfaces, metrics);
  const averageRTT = getAverageRTT(interfaces, metrics);
  const averageThroughput = getAverageThroughput(interfaces, metrics);
  const rttDelta = getAverageDelta(interfaces, metrics, 'rtt');
  const throughputDelta = getAverageDelta(interfaces, metrics, 'throughput');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-sm font-medium text-gray-600">Link Health</CardTitle>
          <CardDescription className="text-xs">Best and worst performing interfaces</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex items-stretch gap-4">
            {bestLink && (
              <>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Best</p>
                    <p className="text-sm font-semibold text-gray-900">{bestLink.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{bestLink.linkType}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span className="text-lg font-bold leading-none">{bestLink.score}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">Score</p>
                  </div>
                </div>
                {worstLink && (
                  <div className="w-px bg-gray-200"></div>
                )}
              </>
            )}
            {worstLink && (
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Worst</p>
                  <p className="text-sm font-semibold text-gray-900">{worstLink.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{worstLink.linkType}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="h-3.5 w-3.5" />
                    <span className="text-lg font-bold leading-none">{worstLink.score}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Score</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-sm font-medium text-gray-600">Network Averages</CardTitle>
          <CardDescription className="text-xs">Across all interfaces</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-bold text-gray-900 leading-none">{averageRTT}</p>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-xs text-gray-500">RTT (ms)</p>
                {rttDelta && rttDelta.value > 0.5 && (
                  <span className={`text-[10px] flex items-center gap-0.5 ${
                    rttDelta.isPositive ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {rttDelta.isPositive ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                    {rttDelta.value.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 leading-none">{averageThroughput}</p>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-xs text-gray-500 whitespace-nowrap">Throughput (Mbps)</p>
                {throughputDelta && throughputDelta.value > 1 && (
                  <span className={`text-[10px] flex items-center gap-0.5 ${
                    throughputDelta.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {throughputDelta.isPositive ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                    {throughputDelta.value.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

