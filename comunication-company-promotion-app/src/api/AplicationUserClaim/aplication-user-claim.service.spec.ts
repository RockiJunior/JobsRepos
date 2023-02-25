import { Test, TestingModule } from '@nestjs/testing';
import { AplicationUserClaimService } from './aplication-user-claim.service';

describe('AplicationUserClaimService', () => {
  let service: AplicationUserClaimService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AplicationUserClaimService],
    }).compile();

    service = module.get<AplicationUserClaimService>(AplicationUserClaimService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
