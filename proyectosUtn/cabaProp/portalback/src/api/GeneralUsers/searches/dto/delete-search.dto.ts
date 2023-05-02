import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteSearchDto {
	@ApiProperty({
		description: 'Search name',
	})
	@IsNotEmpty({
		message: 'Please enter the search name',
	})
	name: string;
}
