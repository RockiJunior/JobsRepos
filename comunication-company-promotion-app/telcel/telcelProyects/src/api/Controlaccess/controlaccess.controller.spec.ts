import { Test, TestingModule } from '@nestjs/testing';
import { ControlaccessController } from './controlaccess.controller';
import { ControlaccessService } from './controlaccess.service';

describe('ControlaccessController', () => {
  let controller: ControlaccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlaccessController],
      providers: [ControlaccessService],
    }).compile();

    controller = module.get<ControlaccessController>(ControlaccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
