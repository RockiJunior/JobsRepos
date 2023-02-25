import { IsString, Length, IsEnum, IsOptional, IsNumber, IsNotEmpty, IsBoolean, IsDate } from 'class-validator';
import { DIGITS_PHONE_NUMBER, EnumGender } from '../../../common/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RankingLeadershipPatchDTO {

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    readonly id: number;

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
    readonly minimal_associates: number;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    readonly associate_type: string;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    readonly minimum_outlay: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    readonly min_act_percentage: number;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional()
    readonly trainging_status: boolean;


}
