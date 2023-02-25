import { Test, TestingModule } from '@nestjs/testing';
import { ControlaccessTagService } from './controlaccess-tag.service';

describe('ControlaccessTagService', () => {
  let service: ControlaccessTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlaccessTagService],
    }).compile();

    service = module.get<ControlaccessTagService>(ControlaccessTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
