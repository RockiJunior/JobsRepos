import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { EnumStatus } from '../../../common/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StatementsRegisterDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsEnum(EnumStatus)
  @ApiProperty({ enum: EnumStatus })
  readonly status: EnumStatus;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly createDate: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly validityDate: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly type: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly url?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly pdfUrl?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly videoUrl?: string;
}

export class UpdateStatementsFilesDto {
  @ApiProperty({ type: 'file' })
  readonly pdfUrl?: Express.Multer.File[];

  @ApiProperty({ type: 'file' })
  readonly videoUrl?: Express.Multer.File[];
}
