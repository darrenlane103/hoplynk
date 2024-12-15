import { Device, Metric, NetworkInterface } from '@/features/monitoring/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatLinkType } from '@/features/monitoring/lib/metrics';
import { getLatestMetricsByInterface } from '@/features/monitoring/lib/metric-aggregation';

type PopSummaryCardProps = {
  device: Device;
  interfaces: NetworkInterface[];
  metrics: Metric[];
};

function calculateHealthCounts(metrics: Metric[]): { healthy: number; degraded: number; down: number } {
  const latestMetrics = getLatestMetricsByInterface(metrics);
  const counts = { healthy: 0, degraded: 0, down: 0 };

  for (const metric of latestMetrics.values()) {
    const status = metric.status.toLowerCase();
    counts[status as keyof typeof counts] = (counts[status as keyof typeof counts] || 0) + 1;
  }

  return counts;
}

function getWorstInterface(
  interfaces: NetworkInterface[],
  metrics: Metric[]
): { name: string; linkType: string } | null {
  const latestMetrics = getLatestMetricsByInterface(metrics);
  let worstInterface: { id: string; score: number } | null = null;

  for (const iface of interfaces) {
    const metric = latestMetrics.get(iface.id);
    if (metric) {
      if (!worstInterface || metric.score < worstInterface.score) {
        worstInterface = { id: iface.id, score: metric.score };
      }
    }
  }

  if (!worstInterface) return null;

  const iface = interfaces.find((i) => i.id === worstInterface!.id);
  if (!iface) return null;

  const metric = latestMetrics.get(iface.id);
  if (!metric || metric.status.toLowerCase() === 'healthy') return null;

  return { name: iface.name, linkType: iface.link_type };
}

function getOverallStatus(healthCounts: {
  healthy: number;
  degraded: number;
  down: number;
}): 'healthy' | 'degraded' | 'down' {
  if (healthCounts.down > 0) return 'down';
  if (healthCounts.degraded > 0) return 'degraded';
  return 'healthy';
}

export function PopSummaryCard({ device, interfaces, metrics }: PopSummaryCardProps) {
  const healthCounts = calculateHealthCounts(metrics);
  const overallStatus = getOverallStatus(healthCounts);
  const worstInterface = getWorstInterface(interfaces, metrics);

  const statusConfig = {
    healthy: { label: 'Healthy' },
    degraded: { label: 'Degraded' },
    down: { label: 'Down' },
  };

  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 mb-0.5">{device.name}</CardTitle>
            <CardDescription className="text-xs text-gray-600">{device.location}</CardDescription>
          </div>
          <div className="flex items-center gap-1.5 ml-4">
            <div className={`h-2 w-2 rounded-full ${
              overallStatus === 'down' ? 'bg-red-500' : 
              overallStatus === 'degraded' ? 'bg-yellow-500' : 
              'bg-green-500'
            }`}></div>
            <span className={`text-xs font-semibold ${
              overallStatus === 'down' ? 'text-red-600' : 
              overallStatus === 'degraded' ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {statusConfig[overallStatus].label}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-3 flex-1 flex flex-col">
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-blue-100">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600 leading-none">{healthCounts.healthy}</div>
            <div className="text-xs text-gray-600 mt-1">Healthy</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-600 leading-none">{healthCounts.degraded}</div>
            <div className="text-xs text-gray-600 mt-1">Degraded</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-600 leading-none">{healthCounts.down}</div>
            <div className="text-xs text-gray-600 mt-1">Down</div>
          </div>
        </div>
        {worstInterface && (overallStatus === 'degraded' || overallStatus === 'down') && (
          <div className="text-xs text-gray-500 pt-2 mt-2 border-t border-blue-100">
            Degraded due to: <span className="font-medium text-gray-700">{formatLinkType(worstInterface.linkType)} ({worstInterface.name})</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
