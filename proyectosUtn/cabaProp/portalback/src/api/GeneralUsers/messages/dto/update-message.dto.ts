import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMessageDto {
	@ApiProperty({
		description: 'Message to update',
	})
	@IsString()
	@IsNotEmpty({
		message: 'Pleas enter the message',
	})
	message: string;
}
