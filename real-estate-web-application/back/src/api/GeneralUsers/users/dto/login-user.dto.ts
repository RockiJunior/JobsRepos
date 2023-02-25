import { IsEmail } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
	@ApiProperty({
		description: 'User email',
	})
	@IsEmail()
	@IsNotEmpty({
		message: 'Please enter a user email',
	})
	email: string;

	@ApiProperty({
		description: 'User password',
	})
	@IsNotEmpty({
		message: 'Please enter a user password',
	})
	@MinLength(4)
	@MaxLength(16)
	password: string;
}
