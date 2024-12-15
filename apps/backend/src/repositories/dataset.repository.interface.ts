import { Device } from '../models/device.model';
import { NetworkInterface } from '../models/interface.model';
import { Metric } from '../models/metric.model';

export interface IDatasetRepository {
  getDevice(): Promise<Device>;
  getInterfaces(): Promise<NetworkInterface[]>;
  getMetrics(): Promise<Metric[]>;
}
