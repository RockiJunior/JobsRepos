import { Test, TestingModule } from '@nestjs/testing';
import { TagsConfigController } from './tags-config.controller';
import { TagsConfigService } from './tags-config.service';

describe('TagsConfigController', () => {
  let controller: TagsConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsConfigController],
      providers: [TagsConfigService],
    }).compile();

    controller = module.get<TagsConfigController>(TagsConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
