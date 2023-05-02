import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePostDto {
	@ApiProperty({
		description: 'Property Id',
	})
	@IsNotEmpty({
		message: 'Please enter a property Id',
	})
	propertyId: string;
}
