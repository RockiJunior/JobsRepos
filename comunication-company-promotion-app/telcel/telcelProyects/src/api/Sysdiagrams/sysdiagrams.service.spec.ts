import { Test, TestingModule } from '@nestjs/testing';
import { SysdiagramsService } from './sysdiagrams.service';

describe('SysdiagramsService', () => {
  let service: SysdiagramsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysdiagramsService],
    }).compile();

    service = module.get<SysdiagramsService>(SysdiagramsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
