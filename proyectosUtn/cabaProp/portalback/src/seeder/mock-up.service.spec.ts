import { Test, TestingModule } from '@nestjs/testing';
import { MockUpService } from './mock-up.service';

describe('MockUpService', () => {
  let service: MockUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockUpService],
    }).compile();

    service = module.get<MockUpService>(MockUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
