import { IsString, Length, IsEnum, IsOptional, IsNumber, IsNotEmpty, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommissionsPatchDTO {
    @IsOptional()
    @IsString()
    @Length(1, 255)
    @ApiPropertyOptional()
    readonly commissionName: string;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    readonly conceptId: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    readonly typeCommissionId: number;

    @IsOptional()
    @IsString()
    @Length(1, 255)
    @ApiPropertyOptional()
    readonly ranking: string;

    @IsOptional()
    @IsString()
    @Length(1, 255)
    @ApiPropertyOptional()
    readonly group: string;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    readonly levelId: number;

    @IsOptional()
    @IsString()
    @Length(1, 255)
    @ApiPropertyOptional()
    readonly calculationBasis: string;

    @IsOptional()
    @IsString()
    @Length(1, 255)
    @ApiPropertyOptional()
    readonly rule: string;

    @IsOptional()
    @IsString()
    @Length(1, 255)
    @ApiPropertyOptional()
    readonly ruleValue: string;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    readonly ruleComputeValue: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    readonly measurmentUnitId: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    readonly measurment_value: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    readonly paymentChronologyId: number;

    @IsOptional()
    @IsDate()
    @ApiPropertyOptional()
    readonly apply_since: Date;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional()
    readonly is_active: boolean;



}

