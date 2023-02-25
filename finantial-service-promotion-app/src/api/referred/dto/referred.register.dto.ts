import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Partner } from 'src/common/database_entities/partner.entity';

export class ReferredRegisterDTO {
  @IsOptional()
  @ApiProperty()
  partner: Partner;

  @IsOptional()
  @ApiProperty()
  referred: Partner;
}
