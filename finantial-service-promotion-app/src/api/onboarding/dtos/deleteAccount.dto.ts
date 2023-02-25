import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteAccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly reason: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly writtenReason?: string;
}
