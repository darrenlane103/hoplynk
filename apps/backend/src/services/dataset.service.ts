import { Injectable, Inject } from '@nestjs/common';
import { IDatasetRepository } from '../repositories/dataset.repository.interface';
import { Device } from '../models/device.model';
import { NetworkInterface } from '../models/interface.model';
import { Metric } from '../models/metric.model';

@Injectable()
export class DatasetService {
  constructor(
    @Inject('IDatasetRepository')
    private readonly datasetRepository: IDatasetRepository
  ) {}

  async getDevice(): Promise<Device> {
    return this.datasetRepository.getDevice();
  }

  async getInterfaces(): Promise<NetworkInterface[]> {
    return this.datasetRepository.getInterfaces();
  }

  async getMetrics(): Promise<Metric[]> {
    return this.datasetRepository.getMetrics();
  }
}
