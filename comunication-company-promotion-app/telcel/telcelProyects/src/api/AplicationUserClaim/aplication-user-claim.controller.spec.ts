import { Test, TestingModule } from '@nestjs/testing';
import { AplicationUserClaimController } from './aplication-user-claim.controller';
import { AplicationUserClaimService } from './aplication-user-claim.service';

describe('AplicationUserClaimController', () => {
  let controller: AplicationUserClaimController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AplicationUserClaimController],
      providers: [AplicationUserClaimService],
    }).compile();

    controller = module.get<AplicationUserClaimController>(AplicationUserClaimController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
