import { IsNumber, IsOptional } from 'class-validator';

export class PostsPaginationDto {
	@IsNumber()
	@IsOptional()
	limit?: number;

	@IsNumber()
	@IsOptional()
	offset?: number;
}
