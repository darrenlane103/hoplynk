import { getMonitoringDashboardData } from '@/features/monitoring/server/get-monitoring-dashboard-data';
import { MonitoringDashboard } from '@/features/monitoring/components/monitoring-dashboard';

export default async function DashboardPage() {
  const { device, interfaces, metrics } = await getMonitoringDashboardData();

  if (!device || interfaces.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">No Data Available</h2>
          <p className="text-gray-600">
            The device or interfaces data could not be loaded. Please check the API connection.
          </p>
        </div>
      </div>
    );
  }

  return <MonitoringDashboard device={device} interfaces={interfaces} metrics={metrics} />;
}
