import { getLatestMetricForInterface, formatLinkType } from './metrics';
import { Metric } from '@/features/monitoring/types';

describe('metrics utilities', () => {
  describe('getLatestMetricForInterface', () => {
    const mockMetrics: Metric[] = [
      {
        timestamp: '2025-01-29T18:20:00Z',
        interface_id: 'router-01/eth0',
        rtt_ms: 12,
        latency_ms: 12,
        jitter_ms: 1,
        packet_loss: 0.0,
        throughput_mbps: 410,
        score: 96,
        status: 'healthy',
      },
      {
        timestamp: '2025-01-29T18:24:00Z',
        interface_id: 'router-01/eth0',
        rtt_ms: 13,
        latency_ms: 13,
        jitter_ms: 2,
        packet_loss: 0.0,
        throughput_mbps: 415,
        score: 96,
        status: 'healthy',
      },
    ];

    it('returns the latest metric for a given interface', () => {
      const result = getLatestMetricForInterface(mockMetrics, 'router-01/eth0');
      expect(result).not.toBeNull();
      expect(result?.timestamp).toBe('2025-01-29T18:24:00Z');
      expect(result?.throughput_mbps).toBe(415);
    });

    it('returns null when no metrics exist for interface', () => {
      const result = getLatestMetricForInterface(mockMetrics, 'router-01/nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('formatLinkType', () => {
    it('formats link types correctly', () => {
      expect(formatLinkType('ethernet')).toBe('Ethernet');
      expect(formatLinkType('wifi')).toBe('Wi-Fi');
      expect(formatLinkType('cellular')).toBe('Cellular');
      expect(formatLinkType('satellite')).toBe('Satellite');
    });

    it('returns original string for unknown types', () => {
      expect(formatLinkType('unknown')).toBe('unknown');
    });
  });
});

