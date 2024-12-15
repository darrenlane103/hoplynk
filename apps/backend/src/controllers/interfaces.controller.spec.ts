import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { InterfacesController } from './interfaces.controller';
import { DatasetService } from '../services/dataset.service';
import { JsonFileAdapter } from '../adapters/json-file.adapter';
import { createMockInterfaces } from '../__fixtures__/interface.fixture';
import * as path from 'path';

describe('InterfacesController', () => {
  let controller: InterfacesController;
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
      controllers: [InterfacesController],
      providers: [
        JsonFileAdapter,
        {
          provide: 'IDatasetRepository',
          useClass: JsonFileAdapter,
        },
        DatasetService,
      ],
    }).compile();

    controller = module.get<InterfacesController>(InterfacesController);
    datasetService = module.get<DatasetService>(DatasetService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getInterfaces', () => {
    it('should return array of interfaces', async () => {
      const result = await controller.getInterfaces();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4);
    });

    it('should return interfaces with required properties matching model', async () => {
      const result = await controller.getInterfaces();
      const mockInterfaces = createMockInterfaces();

      result.forEach((iface, index) => {
        expect(iface).toHaveProperty('id');
        expect(iface).toHaveProperty('device_id');
        expect(iface).toHaveProperty('name');
        expect(iface).toHaveProperty('link_type');
        expect(iface).toHaveProperty('provider');
        expect(iface).toHaveProperty('priority');
        expect(typeof iface.id).toBe('string');
        expect(typeof iface.name).toBe('string');
        expect(['ethernet', 'wifi', 'cellular', 'satellite']).toContain(iface.link_type);

        expect(Object.keys(iface)).toEqual(Object.keys(mockInterfaces[index]));
      });
    });

    it('should return interfaces in correct order', async () => {
      const result = await controller.getInterfaces();

      expect(result[0].name).toBe('eth0');
      expect(result[1].name).toBe('wlan0');
      expect(result[2].name).toBe('lte0');
      expect(result[3].name).toBe('starlink0');
    });

    it('should throw HttpException when dataset service fails', async () => {
      jest
        .spyOn(datasetService, 'getInterfaces')
        .mockRejectedValue(new Error('Dataset load failed'));

      await expect(controller.getInterfaces()).rejects.toThrow();
    });
  });
});
