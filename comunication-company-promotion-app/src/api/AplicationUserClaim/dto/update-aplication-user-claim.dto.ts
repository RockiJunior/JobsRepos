import { PartialType } from '@nestjs/swagger';
import { CreateAplicationUserClaimDto } from './create-aplication-user-claim.dto';

export class UpdateAplicationUserClaimDto extends PartialType(CreateAplicationUserClaimDto) {}
