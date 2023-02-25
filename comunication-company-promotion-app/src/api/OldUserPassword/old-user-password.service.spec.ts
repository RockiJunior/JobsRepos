import { Test, TestingModule } from '@nestjs/testing';
import { OldUserPasswordService } from './old-user-password.service';

describe('OldUserPasswordService', () => {
  let service: OldUserPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OldUserPasswordService],
    }).compile();

    service = module.get<OldUserPasswordService>(OldUserPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
