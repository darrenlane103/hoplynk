import { Device } from './device.model';
import { NetworkInterface } from './interface.model';
import { Metric } from './metric.model';

export interface Dataset {
  device: Device;
  interfaces: NetworkInterface[];
  metrics: Metric[];
}
