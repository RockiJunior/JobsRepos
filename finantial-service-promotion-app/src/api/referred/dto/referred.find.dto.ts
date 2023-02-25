import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReferredFindDTO {
  @IsOptional()
  @ApiPropertyOptional()
  readonly idPartner?;

  @IsOptional()
  @ApiPropertyOptional()
  readonly idReferred?;
}
