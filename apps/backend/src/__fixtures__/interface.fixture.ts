import { NetworkInterface } from '../models/interface.model';

export const createMockInterface = (overrides?: Partial<NetworkInterface>): NetworkInterface => ({
  id: 'eth0',
  device_id: 'router-01',
  name: 'eth0',
  link_type: 'ethernet',
  provider: 'ISP1',
  priority: 1,
  ...overrides,
});

export const createMockInterfaces = (): NetworkInterface[] => [
  createMockInterface({ id: 'eth0', name: 'eth0', link_type: 'ethernet', priority: 1 }),
  createMockInterface({ id: 'wlan0', name: 'wlan0', link_type: 'wifi', priority: 2 }),
  createMockInterface({ id: 'lte0', name: 'lte0', link_type: 'cellular', priority: 3 }),
  createMockInterface({ id: 'starlink0', name: 'starlink0', link_type: 'satellite', priority: 4 }),
];
