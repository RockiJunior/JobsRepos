import { IsEmail } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReSendDto {
	@ApiProperty({
		description: 'Email of user to re send email confirmation',
	})
	@IsNotEmpty({
		message: 'Please enter the user email to re send confirmation',
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		description: 'DNI of user to re send email confirmation',
	})
	@IsNotEmpty({
		message: 'Please enter the user DNI to re send confirmation',
	})
	dni: string;
}
