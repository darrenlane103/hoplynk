'use client';

import { useState } from 'react';
import { NetworkInterface, Metric } from '@/features/monitoring/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LinkTypeIcon } from './link-type-icon';
import { ScoreSparkline } from './score-sparkline';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { formatLinkType, formatRelativeTime } from '@/features/monitoring/lib/metrics';
import { getStatusColor, getStatusBadgeColor } from '@/features/monitoring/lib/status-helpers';
import { calculateTrend, getTrendIcon, getTrendColor } from '@/features/monitoring/lib/trend-helpers';

type InterfaceCardMobileProps = {
  interfaces: NetworkInterface[];
  metrics: Metric[];
  latestMetrics: Map<string, Metric>;
};

export function InterfaceCardMobile({
  interfaces,
  metrics,
  latestMetrics,
}: InterfaceCardMobileProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpanded = (interfaceId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [interfaceId]: !prev[interfaceId],
    }));
  };

  return (
    <div className="md:hidden space-y-3">
      {interfaces.map((iface) => {
        const latestMetric = latestMetrics.get(iface.id);
        if (!latestMetric) return null;

        const status = latestMetric.status;
        const isExpanded = expanded[iface.id] || false;
        const trend = calculateTrend(metrics, iface.id);
        const TrendIcon = getTrendIcon(trend);
        const hasThroughput = latestMetric.throughput_mbps > 0;
        const hasPacketLoss = latestMetric.packet_loss > 0;

        return (
          <Card
            key={iface.id}
            className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader
              className="px-4 py-3 cursor-pointer"
              onClick={() => toggleExpanded(iface.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleExpanded(iface.id);
                }
              }}
              aria-expanded={isExpanded}
              aria-controls={`interface-${iface.id}-details`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-3 w-3 rounded-full flex-shrink-0 mt-1 ${getStatusColor(status)}`}
                  aria-label={`${status} status`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-900 break-words">
                      {iface.name}
                    </h3>
                    <LinkTypeIcon
                      linkType={iface.link_type}
                      className="text-gray-400"
                      size={14}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500">
                      {formatLinkType(iface.link_type)}
                    </span>
                    <span className="text-xs text-gray-400" aria-hidden="true">
                      •
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                        status === 'down'
                          ? 'bg-red-100 text-red-900 border-red-300'
                          : status === 'degraded'
                            ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                            : getStatusBadgeColor(status)
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <div
                        className={`text-xl font-bold leading-none ${
                          status === 'healthy'
                            ? 'text-green-600'
                            : status === 'degraded'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {latestMetric.score}
                      </div>
                      {trend !== 'stable' && (
                        <TrendIcon
                          className={`h-3 w-3 ${getTrendColor(trend)}`}
                          aria-label={`Trend: ${trend}`}
                        />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>

                <button
                  className="flex-shrink-0 p-1 -mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(iface.id);
                  }}
                  aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex-1">
                  {hasThroughput ? (
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {latestMetric.throughput_mbps.toFixed(1)}{' '}
                        <span className="text-xs text-gray-500">Mbps</span>
                      </div>
                      <div className="text-xs text-gray-500">Throughput</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {latestMetric.rtt_ms} <span className="text-xs text-gray-500">ms</span>
                      </div>
                      <div className="text-xs text-gray-500">RTT</div>
                    </div>
                  )}
                </div>

                {hasPacketLoss && (
                  <div className="flex items-center gap-1 px-2">
                    <AlertTriangle
                      className={`h-3.5 w-3.5 ${
                        latestMetric.packet_loss < 0.03 ? 'text-yellow-600' : 'text-red-600'
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-xs ${
                        latestMetric.packet_loss < 0.03
                          ? 'font-semibold text-yellow-600'
                          : 'font-bold text-red-600'
                      }`}
                    >
                      {(latestMetric.packet_loss * 100).toFixed(2)}%
                    </span>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  {formatRelativeTime(latestMetric.timestamp)}
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent
                id={`interface-${iface.id}-details`}
                className="px-4 pt-0 pb-4 border-t border-gray-100"
              >
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {!hasThroughput && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Throughput</div>
                        <div className="text-sm font-semibold text-gray-400">N/A</div>
                      </div>
                    )}

                    <div>
                      <div className="text-xs text-gray-500 mb-1">RTT</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {latestMetric.rtt_ms} <span className="text-xs text-gray-500">ms</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Packet Loss</div>
                      <div className="flex items-center gap-1">
                        {hasPacketLoss && (
                          <AlertTriangle
                            className={`h-3.5 w-3.5 ${
                              latestMetric.packet_loss < 0.03 ? 'text-yellow-600' : 'text-red-600'
                            }`}
                            aria-hidden="true"
                          />
                        )}
                        <div
                          className={`text-sm ${
                            hasPacketLoss
                              ? latestMetric.packet_loss < 0.01
                                ? 'font-semibold text-green-600'
                                : latestMetric.packet_loss < 0.03
                                  ? 'font-semibold text-yellow-600'
                                  : 'font-bold text-red-600'
                              : 'font-normal text-gray-400'
                          }`}
                        >
                          {(latestMetric.packet_loss * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Jitter</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {latestMetric.jitter_ms} <span className="text-xs text-gray-500">ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs text-gray-500 mb-2">Score Trend (Last 5 min)</div>
                    <ScoreSparkline metrics={metrics} interfaceId={iface.id} status={status} />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

