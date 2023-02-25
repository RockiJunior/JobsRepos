import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSearchDto {
	@ApiProperty({
		description: 'New name for the search',
	})
	name: string;
}
