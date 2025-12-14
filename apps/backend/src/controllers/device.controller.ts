import { Controller, Get } from '@nestjs/common';
import { DatasetService } from '../services/dataset.service';

@Controller()
export class DeviceController {
  constructor(private readonly datasetService: DatasetService) {}

  @Get('device')
  async getDevice() {
    return this.datasetService.getDevice();
  }
}
