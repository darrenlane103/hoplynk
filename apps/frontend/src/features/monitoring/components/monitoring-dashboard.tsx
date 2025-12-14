import { Device, NetworkInterface, Metric } from '@/features/monitoring/types';
import { InterfaceListView } from '@/features/monitoring/components/interface-list-view';
import { MetricsSummaryCards } from '@/features/monitoring/components/metrics-summary-cards';
import { CompactStatusChanges } from '@/features/monitoring/components/compact-status-changes';
import { CompactTrendSummary } from '@/features/monitoring/components/compact-trend-summary';
import { OnlineStatusBanner } from '@/features/monitoring/components/online-status-banner.client';

type MonitoringDashboardProps = {
  device: Device;
  interfaces: NetworkInterface[];
  metrics: Metric[];
};

export function MonitoringDashboard({
  device,
  interfaces,
  metrics,
}: MonitoringDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 px-8 pt-4 pb-8 md:px-16 md:pt-4 md:pb-16">
      <div className="mx-auto max-w-7xl space-y-6">
        <OnlineStatusBanner />

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4">Overview</h2>
          <MetricsSummaryCards interfaces={interfaces} metrics={metrics} />
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4">Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CompactStatusChanges interfaces={interfaces} metrics={metrics} />
            <CompactTrendSummary interfaces={interfaces} metrics={metrics} />
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4">Interface Details</h2>
          <InterfaceListView interfaces={interfaces} metrics={metrics} />
        </div>
      </div>
    </div>
  );
}
