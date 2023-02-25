import { Test, TestingModule } from '@nestjs/testing';
import { TagsConfigService } from './tags-config.service';

describe('TagsConfigService', () => {
  let service: TagsConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagsConfigService],
    }).compile();

    service = module.get<TagsConfigService>(TagsConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
