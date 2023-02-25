import { Test, TestingModule } from '@nestjs/testing';
import { OldUserPasswordController } from './old-user-password.controller';
import { OldUserPasswordService } from './old-user-password.service';

describe('OldUserPasswordController', () => {
  let controller: OldUserPasswordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OldUserPasswordController],
      providers: [OldUserPasswordService],
    }).compile();

    controller = module.get<OldUserPasswordController>(OldUserPasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
