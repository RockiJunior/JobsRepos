import { IsNumber } from '@nestjs/class-validator';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
	@IsNumber()
	@IsOptional()
	limit?: number;

	@IsNumber()
	@IsOptional()
	offset?: number;
}
