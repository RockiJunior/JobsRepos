import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EnumFilesStatusPatch } from 'src/common/constants';

export class UpdateFileStatusDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly id_file: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EnumFilesStatusPatch)
  @ApiProperty({ enum: EnumFilesStatusPatch })
  readonly status: EnumFilesStatusPatch;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly reason?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly external_id?: string;
}
