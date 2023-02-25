import { Test, TestingModule } from '@nestjs/testing';
import { ControlaccessdatesService } from './controlaccessdates.service';

describe('ControlaccessdatesService', () => {
  let service: ControlaccessdatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlaccessdatesService],
    }).compile();

    service = module.get<ControlaccessdatesService>(ControlaccessdatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
