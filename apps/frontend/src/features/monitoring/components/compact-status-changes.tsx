import { useMemo } from 'react';
import { NetworkInterface, Metric } from '@/features/monitoring/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkTypeIcon } from './link-type-icon';
import { Clock, ArrowRight } from 'lucide-react';
import { getStatusTransitions } from '@/features/monitoring/lib/status-transitions';
import { getStatusColorForTransition } from '@/features/monitoring/lib/status-helpers';

type CompactStatusChangesProps = {
  interfaces: NetworkInterface[];
  metrics: Metric[];
};

export function CompactStatusChanges({ interfaces, metrics }: CompactStatusChangesProps) {
  const transitions = useMemo(
    () => getStatusTransitions(interfaces, metrics),
    [interfaces, metrics]
  );

  if (transitions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Status Changes</CardTitle>
          <CardDescription className="text-xs">No status changes in the last 5 minutes</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Recent Status Changes</CardTitle>
        <CardDescription className="text-xs">{transitions.length} status transition{transitions.length !== 1 ? 's' : ''} in last 5 min</CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <div className="max-h-48 overflow-y-auto overflow-x-hidden space-y-2">
          {transitions.map((transition, idx) => {
            const time = new Date(transition.timestamp);
            const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const isMostRecent = idx === 0;
            const fromStatusColor = getStatusColorForTransition(transition.fromStatus);

            return (
              <div
                key={idx}
                className={`flex items-center gap-1.5 text-xs py-2 border-b border-gray-100 last:border-0 min-w-0 ${
                  isMostRecent ? 'bg-blue-50/50 px-2 -mx-2 rounded' : ''
                }`}
              >
                <Clock
                  className={`h-3.5 w-3.5 flex-shrink-0 ${isMostRecent ? 'text-blue-600' : 'text-gray-400'}`}
                />
                <span
                  className={`flex-shrink-0 ${isMostRecent ? 'font-semibold text-blue-700' : 'text-gray-500'}`}
                >
                  {timeStr}
                </span>
                <div className="flex items-center gap-1 min-w-0 flex-shrink">
                  <span
                    className={`font-medium truncate ${isMostRecent ? 'text-gray-900' : 'text-gray-700'}`}
                  >
                    {transition.interfaceName}
                  </span>
                  <LinkTypeIcon
                    linkType={transition.linkType}
                    className="text-gray-400 flex-shrink-0"
                    size={12}
                  />
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0 whitespace-nowrap ${fromStatusColor}`}
                >
                  {transition.fromStatus}
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <span
                  className={`px-1.5 py-0.5 rounded text-xs font-semibold flex-shrink-0 whitespace-nowrap ${getStatusColorForTransition(transition.toStatus)}`}
                >
                  {transition.toStatus}
                </span>
                <span
                  className={`ml-auto flex-shrink-0 whitespace-nowrap ${isMostRecent ? 'font-semibold text-gray-900' : 'text-gray-400'}`}
                >
                  {transition.score}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

