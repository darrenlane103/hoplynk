import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Dataset } from '../models/dataset.model';
import { Device } from '../models/device.model';
import { NetworkInterface } from '../models/interface.model';
import { Metric } from '../models/metric.model';
import { IDatasetRepository } from '../repositories/dataset.repository.interface';
import { DataSourceUnavailableError } from '../common/errors/data-source-unavailable.error';
import { validateDataset } from '../utils/dataset-validator.util';

@Injectable()
export class JsonFileAdapter implements IDatasetRepository, OnModuleDestroy {
  private readonly logger = new Logger(JsonFileAdapter.name);
  private readonly dataPath: string;
  private fileExists: Promise<boolean>;

  constructor(private readonly configService: ConfigService) {
    const dataFile = this.configService.get<string>('DATA_FILE')!;

    if (path.isAbsolute(dataFile)) {
      this.dataPath = path.normalize(dataFile);
    } else {
      this.dataPath = path.normalize(path.resolve(process.cwd(), dataFile));
    }

    this.validateFilePath(this.dataPath);

    this.fileExists = fs
      .access(this.dataPath)
      .then(() => {
        this.logger.log(`Dataset file path: ${this.dataPath}`);
        return true;
      })
      .catch(() => {
        this.logger.error(`Dataset file does not exist at ${this.dataPath}`);
        return false;
      });
  }

  private validateFilePath(filePath: string): void {
    const normalizedPath = path.normalize(filePath);
    const resolvedPath = path.resolve(normalizedPath);

    if (path.isAbsolute(filePath)) {
      const cwd = process.cwd();
      if (!resolvedPath.startsWith(cwd) && !resolvedPath.startsWith('/')) {
        this.logger.warn(`File path is outside current working directory: ${resolvedPath}`);
      }
    }

    if (normalizedPath.includes('..')) {
      this.logger.warn(`File path contains parent directory references: ${normalizedPath}`);
    }
  }

  async isAvailable(): Promise<boolean> {
    return this.fileExists;
  }

  async getDevice(): Promise<Device> {
    const dataset = await this.readDataset();
    return dataset.device;
  }

  async getInterfaces(): Promise<NetworkInterface[]> {
    const dataset = await this.readDataset();
    return dataset.interfaces;
  }

  async getMetrics(): Promise<Metric[]> {
    const dataset = await this.readDataset();
    return dataset.metrics;
  }

  private async readDataset(): Promise<Dataset> {
    const exists = await this.fileExists;
    if (!exists) {
      throw new DataSourceUnavailableError(`Dataset file does not exist at ${this.dataPath}`, {
        filePath: this.dataPath,
      });
    }

    try {
      const fileContent = await fs.readFile(this.dataPath, 'utf-8');
      const parsedData = JSON.parse(fileContent);
      const dataset = validateDataset(parsedData);

      this.logger.log('Dataset loaded and validated successfully from JSON file');
      return dataset;
    } catch (error) {
      if (error instanceof DataSourceUnavailableError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to read dataset: ${errorMessage}`, errorStack);
      throw new DataSourceUnavailableError(`Failed to read dataset: ${errorMessage}`, {
        filePath: this.dataPath,
        originalError: errorMessage,
      });
    }
  }

  onModuleDestroy() {}
}
