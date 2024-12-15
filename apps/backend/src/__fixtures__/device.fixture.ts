import { Device } from '../models/device.model';

export const createMockDevice = (overrides?: Partial<Device>): Device => ({
  id: 'router-01',
  name: 'Edge Router 01',
  location: 'Test Lab',
  ...overrides,
});
