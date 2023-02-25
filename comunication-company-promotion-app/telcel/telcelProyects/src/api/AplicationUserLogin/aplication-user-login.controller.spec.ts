import { Test, TestingModule } from '@nestjs/testing';
import { AplicationUserLoginController } from './aplication-user-login.controller';
import { AplicationUserLoginService } from './aplication-user-login.service';

describe('AplicationUserLoginController', () => {
  let controller: AplicationUserLoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AplicationUserLoginController],
      providers: [AplicationUserLoginService],
    }).compile();

    controller = module.get<AplicationUserLoginController>(AplicationUserLoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
