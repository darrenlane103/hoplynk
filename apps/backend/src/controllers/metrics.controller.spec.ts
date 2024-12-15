import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MetricsController } from './metrics.controller';
import { DatasetService } from '../services/dataset.service';
import { JsonFileAdapter } from '../adapters/json-file.adapter';
import { createMockMetric } from '../__fixtures__/metric.fixture';
import * as path from 'path';

describe('MetricsController', () => {
  let controller: MetricsController;
  let datasetService: DatasetService;

  beforeEach(async () => {
    const testDataPath = path.resolve(process.cwd(), 'data/work_sample_data.json');

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [],
          load: [
            () => ({
              DATA_FILE: testDataPath,
            }),
          ],
        }),
      ],
      controllers: [MetricsController],
      providers: [
        JsonFileAdapter,
        {
          provide: 'IDatasetRepository',
          useClass: JsonFileAdapter,
        },
        DatasetService,
      ],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
    datasetService = module.get<DatasetService>(DatasetService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMetrics', () => {
    it('should return array of metrics', async () => {
      const result = await controller.getMetrics();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return metrics with required properties matching model', async () => {
      const result = await controller.getMetrics();
      const mockMetric = createMockMetric();

      result.forEach((metric) => {
        expect(metric).toHaveProperty('timestamp');
        expect(metric).toHaveProperty('interface_id');
        expect(metric).toHaveProperty('rtt_ms');
        expect(metric).toHaveProperty('latency_ms');
        expect(metric).toHaveProperty('jitter_ms');
        expect(metric).toHaveProperty('packet_loss');
        expect(metric).toHaveProperty('throughput_mbps');
        expect(metric).toHaveProperty('score');
        expect(metric).toHaveProperty('status');
        expect(typeof metric.timestamp).toBe('string');
        expect(typeof metric.interface_id).toBe('string');
        expect(typeof metric.rtt_ms).toBe('number');
        expect(typeof metric.latency_ms).toBe('number');
        expect(typeof metric.throughput_mbps).toBe('number');
        expect(typeof metric.score).toBe('number');
        expect(['healthy', 'degraded', 'down']).toContain(metric.status);

        expect(Object.keys(metric)).toEqual(Object.keys(mockMetric));
      });
    });

    it('should return metrics for all interfaces', async () => {
      const result = await controller.getMetrics();
      const interfaceIds = new Set(result.map((m) => m.interface_id));

      expect(interfaceIds.size).toBe(4);
    });

    it('should return metrics with valid timestamps', async () => {
      const result = await controller.getMetrics();

      result.forEach((metric) => {
        const timestamp = new Date(metric.timestamp);
        expect(timestamp.getTime()).not.toBeNaN();
      });
    });

    it('should throw HttpException when dataset service fails', async () => {
      jest.spyOn(datasetService, 'getMetrics').mockRejectedValue(new Error('Dataset load failed'));

      await expect(controller.getMetrics()).rejects.toThrow();
    });
  });
});
