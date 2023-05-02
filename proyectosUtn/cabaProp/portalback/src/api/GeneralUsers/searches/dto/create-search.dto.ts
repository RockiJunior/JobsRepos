import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSearchDto {
	@ApiProperty({
		description: 'Path of the search',
	})
	@IsOptional()
	path: string;

	@ApiProperty({
		description: 'Name of the search',
	})
	@IsOptional()
	name: string;

	@ApiProperty({
		isArray: true,
		description: 'Array of tags',
	})
	@IsOptional()
	tags: string[];
}
