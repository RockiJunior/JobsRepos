import { IsString, Length, IsEnum, IsOptional, IsNumber, IsNotEmpty, IsBoolean, IsDate } from 'class-validator';
import { DIGITS_PHONE_NUMBER, EnumGender } from '../../../common/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RankingIndividualPatchDTO {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    readonly level: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    readonly status: boolean;

    @IsNotEmpty()
    @IsDate()
    @ApiProperty()
    readonly apply_since: Date;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    readonly min: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    readonly max: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    readonly score: number;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    readonly activity: string;

}
