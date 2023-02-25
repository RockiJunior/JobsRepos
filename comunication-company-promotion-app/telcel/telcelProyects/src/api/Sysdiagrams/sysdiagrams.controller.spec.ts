import { Test, TestingModule } from '@nestjs/testing';
import { SysdiagramsController } from './sysdiagrams.controller';
import { SysdiagramsService } from './sysdiagrams.service';

describe('SysdiagramsController', () => {
  let controller: SysdiagramsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysdiagramsController],
      providers: [SysdiagramsService],
    }).compile();

    controller = module.get<SysdiagramsController>(SysdiagramsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
