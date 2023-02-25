import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRealEstateDto {
	@ApiProperty({
		description: 'Name of Real Estate',
	})
	@IsNotEmpty({
		message: 'Pleas enter Real Estate name',
	})
	name: string;
}
