import { Test, TestingModule } from '@nestjs/testing';
import { ControlaccessdatesController } from './controlaccessdates.controller';
import { ControlaccessdatesService } from './controlaccessdates.service';

describe('ControlaccessdatesController', () => {
  let controller: ControlaccessdatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlaccessdatesController],
      providers: [ControlaccessdatesService],
    }).compile();

    controller = module.get<ControlaccessdatesController>(ControlaccessdatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
