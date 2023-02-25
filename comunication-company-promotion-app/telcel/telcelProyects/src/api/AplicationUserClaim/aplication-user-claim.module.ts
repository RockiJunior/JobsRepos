import { Module } from '@nestjs/common';
import { AplicationUserClaimService } from './aplication-user-claim.service';
import { AplicationUserClaimController } from './aplication-user-claim.controller';

@Module({
  controllers: [AplicationUserClaimController],
  providers: [AplicationUserClaimService],
})
export class AplicationUserClaimModule {}
