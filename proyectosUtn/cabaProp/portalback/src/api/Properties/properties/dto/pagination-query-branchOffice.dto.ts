import { IsNumber } from '@nestjs/class-validator';
import { IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export class PaginationQueryBranchOfficeDto {
	@IsNumber()
	@IsNotEmpty()
	limit?: number;

	@IsNumber()
	@IsOptional()
	offset?: number;

	@IsOptional()
	field: any;
}
