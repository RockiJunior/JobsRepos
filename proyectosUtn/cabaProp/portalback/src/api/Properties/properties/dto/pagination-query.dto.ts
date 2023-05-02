import { IsNumber } from '@nestjs/class-validator';
import { IsOptional, IsEnum } from 'class-validator';
import {
	FindOptionsPropertyEnum,
	FindOptionsSort,
} from '../../../../config/enum-types';

export class PaginationQueryDto {
	@IsNumber()
	@IsOptional()
	limit?: number;

	@IsNumber()
	@IsOptional()
	offset?: number;

	@IsNumber()
	@IsOptional()
	realEstateId?: number;

	@IsEnum(FindOptionsPropertyEnum)
	@IsOptional()
	orderBy?: FindOptionsPropertyEnum;

	@IsEnum(FindOptionsSort)
	@IsOptional()
	sort?: FindOptionsSort;
}
