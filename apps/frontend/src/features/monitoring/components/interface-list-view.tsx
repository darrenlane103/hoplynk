'use client';

import { useMemo } from 'react';
import { NetworkInterface, Metric } from '@/features/monitoring/types';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { sortInterfacesByPriority, getLatestMetricsMap } from '@/features/monitoring/lib/interface-helpers';
import { InterfaceTableDesktop } from './interface-table-desktop';
import { InterfaceCardMobile } from './interface-card-mobile';

type InterfaceListViewProps = {
  interfaces: NetworkInterface[];
  metrics: Metric[];
};

export function InterfaceListView({ interfaces, metrics }: InterfaceListViewProps) {
  const isOnline = useOnlineStatus();

  const sortedInterfaces = useMemo(
    () => sortInterfacesByPriority(interfaces, metrics),
    [interfaces, metrics]
  );

  const latestMetrics = useMemo(
    () => getLatestMetricsMap(interfaces, metrics),
    [interfaces, metrics]
  );

  return (
    <div className="space-y-4">
      {!isOnline && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 flex items-center gap-2">
          <p className="text-sm text-yellow-800">Offline — showing last known data</p>
        </div>
      )}

      <InterfaceTableDesktop
        interfaces={sortedInterfaces}
        latestMetrics={latestMetrics}
      />

      <InterfaceCardMobile
        interfaces={sortedInterfaces}
        metrics={metrics}
        latestMetrics={latestMetrics}
      />
    </div>
  );
}
