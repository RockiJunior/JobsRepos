import { IsString, Length, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFileStatusDTO {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly id_file?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly status?: string;
}
