import { Test, TestingModule } from '@nestjs/testing';
import { ControlaccessTagController } from './controlaccess-tag.controller';
import { ControlaccessTagService } from './controlaccess-tag.service';

describe('ControlaccessTagController', () => {
  let controller: ControlaccessTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlaccessTagController],
      providers: [ControlaccessTagService],
    }).compile();

    controller = module.get<ControlaccessTagController>(
      ControlaccessTagController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
