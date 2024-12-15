import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DeviceController } from './device.controller';
import { DatasetService } from '../services/dataset.service';
import { JsonFileAdapter } from '../adapters/json-file.adapter';
import { createMockDevice } from '../__fixtures__/device.fixture';
import * as path from 'path';

describe('DeviceController', () => {
  let controller: DeviceController;
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
      controllers: [DeviceController],
      providers: [
        JsonFileAdapter,
        {
          provide: 'IDatasetRepository',
          useClass: JsonFileAdapter,
        },
        DatasetService,
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
    datasetService = module.get<DatasetService>(DatasetService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDevice', () => {
    it('should return device information', async () => {
      const result = await controller.getDevice();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('location');
      expect(result.id).toBe('router-01');
      expect(result.name).toBe('Edge Router 01');
      expect(result.location).toBe('Test Lab');
    });

    it('should throw HttpException when dataset service fails', async () => {
      jest.spyOn(datasetService, 'getDevice').mockRejectedValue(new Error('Dataset load failed'));

      await expect(controller.getDevice()).rejects.toThrow();
    });

    it('should return valid device structure matching model', async () => {
      const result = await controller.getDevice();
      const mockDevice = createMockDevice();

      expect(typeof result.id).toBe('string');
      expect(typeof result.name).toBe('string');
      expect(typeof result.location).toBe('string');
      expect(result.id.length).toBeGreaterThan(0);
      expect(result.name.length).toBeGreaterThan(0);
      expect(result.location.length).toBeGreaterThan(0);

      expect(Object.keys(result)).toEqual(Object.keys(mockDevice));
    });
  });
});
