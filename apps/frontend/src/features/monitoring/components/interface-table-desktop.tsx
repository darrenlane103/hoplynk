'use client';

import { NetworkInterface, Metric } from '@/features/monitoring/types';
import { LinkTypeIcon } from './link-type-icon';
import { formatLinkType, formatRelativeTime } from '@/features/monitoring/lib/metrics';
import { getStatusColor, getStatusBadgeColor } from '@/features/monitoring/lib/status-helpers';
import { AlertTriangle } from 'lucide-react';

type InterfaceTableDesktopProps = {
  interfaces: NetworkInterface[];
  latestMetrics: Map<string, Metric>;
};

export function InterfaceTableDesktop({
  interfaces,
  latestMetrics,
}: InterfaceTableDesktopProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
              >
                Interface
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider"
              >
                Score
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider"
              >
                Throughput
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider"
              >
                RTT (ms)
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider"
              >
                Packet Loss
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider"
              >
                Jitter
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider"
              >
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interfaces.map((iface) => {
              const latestMetric = latestMetrics.get(iface.id);
              if (!latestMetric) return null;

              const status = latestMetric.status;
              const hasPacketLoss = latestMetric.packet_loss > 0;
              const hasHighJitter = latestMetric.jitter_ms > 10;
              const hasThroughput = latestMetric.throughput_mbps > 0;

              return (
                <tr
                  key={iface.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    status === 'down'
                      ? 'bg-red-50/50 border-l-2 border-l-red-500'
                      : status === 'degraded'
                        ? 'bg-yellow-50/40 border-l-2 border-l-yellow-500'
                        : ''
                  }`}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${getStatusColor(status)}`}
                        aria-label={`${status} status`}
                      />
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-semibold text-gray-900">{iface.name}</span>
                        <LinkTypeIcon
                          linkType={iface.link_type}
                          className="text-gray-400"
                          size={14}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatLinkType(iface.link_type)}
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold border-2 ${
                        status === 'down'
                          ? 'bg-red-100 text-red-900 border-red-300'
                          : status === 'degraded'
                            ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                            : getStatusBadgeColor(status)
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span
                      className={`text-lg font-bold ${
                        status === 'healthy'
                          ? 'text-green-600'
                          : status === 'degraded'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}
                    >
                      {latestMetric.score}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {hasThroughput ? (
                      <span className="text-sm font-semibold text-gray-900">
                        {latestMetric.throughput_mbps.toFixed(1)}{' '}
                        <span className="text-xs text-gray-500">Mbps</span>
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {latestMetric.rtt_ms} <span className="text-xs text-gray-500">ms</span>
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      {hasPacketLoss && (
                        <AlertTriangle
                          className={`h-3.5 w-3.5 flex-shrink-0 ${
                            latestMetric.packet_loss < 0.03 ? 'text-yellow-600' : 'text-red-600'
                          }`}
                          aria-hidden="true"
                        />
                      )}
                      <span
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
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span
                      className={`text-sm font-semibold ${
                        hasHighJitter ? 'text-yellow-600' : 'text-gray-900'
                      }`}
                    >
                      {latestMetric.jitter_ms} <span className="text-xs text-gray-500">ms</span>
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(latestMetric.timestamp)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

