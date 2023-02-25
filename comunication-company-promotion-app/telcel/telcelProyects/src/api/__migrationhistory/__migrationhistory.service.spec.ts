import { Test, TestingModule } from '@nestjs/testing';
import { MigrationhistoryService } from './__migrationhistory.service';

describe('MigrationhistoryService', () => {
  let service: MigrationhistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MigrationhistoryService],
    }).compile();

    service = module.get<MigrationhistoryService>(MigrationhistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
