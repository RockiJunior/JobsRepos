import { Test, TestingModule } from '@nestjs/testing';
import { ControlaccessService } from './controlaccess.service';

describe('ControlaccessService', () => {
  let service: ControlaccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlaccessService],
    }).compile();

    service = module.get<ControlaccessService>(ControlaccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
