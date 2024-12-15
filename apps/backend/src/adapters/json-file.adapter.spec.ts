import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { JsonFileAdapter } from './json-file.adapter';
import * as path from 'path';

describe('JsonFileAdapter', () => {
  let adapter: JsonFileAdapter;

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
          validate: () => ({}),
        }),
      ],
      providers: [JsonFileAdapter],
    }).compile();

    adapter = module.get<JsonFileAdapter>(JsonFileAdapter);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('IDatasetRepository interface', () => {
    it('should return device information', async () => {
      const device = await adapter.getDevice();

      expect(device).toBeDefined();
      expect(device.id).toBe('router-01');
      expect(device.name).toBe('Edge Router 01');
      expect(device.location).toBe('Test Lab');
    });

    it('should return interfaces', async () => {
      const interfaces = await adapter.getInterfaces();

      expect(Array.isArray(interfaces)).toBe(true);
      expect(interfaces.length).toBeGreaterThan(0);
      expect(interfaces[0]).toHaveProperty('id');
      expect(interfaces[0]).toHaveProperty('name');
      expect(interfaces[0]).toHaveProperty('link_type');
    });

    it('should return metrics', async () => {
      const metrics = await adapter.getMetrics();

      expect(Array.isArray(metrics)).toBe(true);
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0]).toHaveProperty('timestamp');
      expect(metrics[0]).toHaveProperty('interface_id');
      expect(metrics[0]).toHaveProperty('score');
    });

    it('should return device with correct structure', async () => {
      const device = await adapter.getDevice();

      expect(device).toHaveProperty('id');
      expect(device).toHaveProperty('name');
      expect(device).toHaveProperty('location');
      expect(typeof device.id).toBe('string');
      expect(typeof device.name).toBe('string');
      expect(typeof device.location).toBe('string');
    });
  });
});
