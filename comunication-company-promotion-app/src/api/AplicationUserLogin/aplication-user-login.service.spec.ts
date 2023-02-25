import { Test, TestingModule } from '@nestjs/testing';
import { AplicationUserLoginService } from './aplication-user-login.service';

describe('AplicationUserLoginService', () => {
  let service: AplicationUserLoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AplicationUserLoginService],
    }).compile();

    service = module.get<AplicationUserLoginService>(AplicationUserLoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
