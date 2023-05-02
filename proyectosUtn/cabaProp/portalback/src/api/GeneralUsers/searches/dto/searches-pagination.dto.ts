import { IsNumber, IsOptional } from 'class-validator';

export class SearchesPaginationDto {
	@IsNumber()
	@IsOptional()
	limit?: number;

	@IsNumber()
	@IsOptional()
	offset?: number;
}
