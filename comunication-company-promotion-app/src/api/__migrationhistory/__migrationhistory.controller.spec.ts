import { Test, TestingModule } from '@nestjs/testing';
import { MigrationhistoryController } from './__migrationhistory.controller';
import { MigrationhistoryService } from './__migrationhistory.service';

describe('MigrationhistoryController', () => {
  let controller: MigrationhistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MigrationhistoryController],
      providers: [MigrationhistoryService],
    }).compile();

    controller = module.get<MigrationhistoryController>(MigrationhistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
