import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DatasetService } from './dataset.service';
import { IDatasetRepository } from '../repositories/dataset.repository.interface';
import { createMockDevice } from '../__fixtures__/device.fixture';
import { createMockInterfaces } from '../__fixtures__/interface.fixture';
import { createMockMetrics } from '../__fixtures__/metric.fixture';

describe('DatasetService', () => {
  let service: DatasetService;
  let mockRepository: jest.Mocked<IDatasetRepository>;

  beforeEach(async () => {
    mockRepository = {
      getDevice: jest.fn(),
      getInterfaces: jest.fn(),
      getMetrics: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [
        DatasetService,
        {
          provide: 'IDatasetRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DatasetService>(DatasetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDevice', () => {
    it('should return device information from repository', async () => {
      const mockDevice = createMockDevice();
      mockRepository.getDevice.mockResolvedValue(mockDevice);

      const device = await service.getDevice();

      expect(device).toBeDefined();
      expect(device).toEqual(mockDevice);
      expect(device.id).toBe('router-01');
      expect(device.name).toBe('Edge Router 01');
      expect(device.location).toBe('Test Lab');
      expect(mockRepository.getDevice).toHaveBeenCalledTimes(1);
    });
  });

  describe('getInterfaces', () => {
    it('should return all interfaces from repository', async () => {
      const mockInterfaces = createMockInterfaces();
      mockRepository.getInterfaces.mockResolvedValue(mockInterfaces);

      const interfaces = await service.getInterfaces();

      expect(Array.isArray(interfaces)).toBe(true);
      expect(interfaces.length).toBe(4);
      expect(interfaces).toEqual(mockInterfaces);
      expect(mockRepository.getInterfaces).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMetrics', () => {
    it('should return all metrics from repository', async () => {
      const mockMetrics = createMockMetrics();
      mockRepository.getMetrics.mockResolvedValue(mockMetrics);

      const metrics = await service.getMetrics();

      expect(Array.isArray(metrics)).toBe(true);
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0]).toHaveProperty('timestamp');
      expect(metrics[0]).toHaveProperty('interface_id');
      expect(mockRepository.getMetrics).toHaveBeenCalledTimes(1);
    });
  });
});
