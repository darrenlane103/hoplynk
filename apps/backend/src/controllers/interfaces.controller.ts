import { Controller, Get } from '@nestjs/common';
import { DatasetService } from '../services/dataset.service';

@Controller()
export class InterfacesController {
  constructor(private readonly datasetService: DatasetService) {}

  @Get('interfaces')
  async getInterfaces() {
    return this.datasetService.getInterfaces();
  }
}
