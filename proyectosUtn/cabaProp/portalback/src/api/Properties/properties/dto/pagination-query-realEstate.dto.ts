import { IsNumber } from '@nestjs/class-validator';
import { IsOptional } from 'class-validator';

export class PaginationQueryRealEstateDto {
	@IsNumber()
	@IsOptional()
	limit?: number;

	@IsNumber()
	@IsOptional()
	offset?: number;

	@IsNumber()
	@IsOptional()
	branchOffice?: number;
}
