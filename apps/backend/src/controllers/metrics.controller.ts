import { Controller, Get } from '@nestjs/common';
import { DatasetService } from '../services/dataset.service';

@Controller()
export class MetricsController {
  constructor(private readonly datasetService: DatasetService) {}

  @Get('metrics')
  async getMetrics() {
    return this.datasetService.getMetrics();
  }
}
