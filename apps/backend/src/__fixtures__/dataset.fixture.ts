import { Dataset } from '../models/dataset.model';
import { createMockDevice } from './device.fixture';
import { createMockInterfaces } from './interface.fixture';
import { createMockMetrics } from './metric.fixture';

export const createMockDataset = (overrides?: Partial<Dataset>): Dataset => ({
  device: createMockDevice(),
  interfaces: createMockInterfaces(),
  metrics: createMockMetrics(),
  ...overrides,
});
