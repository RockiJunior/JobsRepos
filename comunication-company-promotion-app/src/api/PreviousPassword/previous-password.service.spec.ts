import { Test, TestingModule } from '@nestjs/testing';
import { PreviousPasswordService } from './previous-password.service';

describe('PreviousPasswordService', () => {
  let service: PreviousPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreviousPasswordService],
    }).compile();

    service = module.get<PreviousPasswordService>(PreviousPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
