import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendVerificationTokenDto {
	@ApiProperty({
		description: 'User email',
	})
	@IsEmail(
		{},
		{
			message: 'Invalid user email',
		}
	)
	email: string;
}
