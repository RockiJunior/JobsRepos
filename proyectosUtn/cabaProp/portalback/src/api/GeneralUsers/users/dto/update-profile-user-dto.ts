import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { IsEqualTo } from '../../users/decorators/isEqualTo.decorator';
import { IsEmail } from '@nestjs/class-validator';
import { PhoneNumberDecorator } from '../decorators/phoneNumber.decorator';

export class UpdateUserProfileDto {
	@ApiProperty({
		description: 'User email',
	})
	@IsOptional()
	@IsNotEmpty({
		message: 'Please enter a user email',
	})
	@IsEmail()
	email?: string;

	//Añadir regex según parámetros de contraseña
	@ApiProperty({
		description: 'Actual Password',
	})
	@IsOptional()
	@IsString()
	@Length(8, 20, { message: 'Contraseña incorrecta' })
	actualPassword?: string;

	@ApiProperty({
		description: 'Password',
	})
	@IsOptional()
	@IsString()
	@Length(8, 20, { message: 'Contraseña incorrecta' })
	newPassword?: string;

	// --------------------------------
	@ApiProperty({
		description: 'Confirm your password',
	})
	@IsOptional()
	@IsEqualTo('newPassword', { message: 'Ambas contraseñas deben ser iguales' })
	confirmPassword?: string;

	@ApiProperty({
		description: 'User phone number',
	})
	@IsOptional()
	@PhoneNumberDecorator({
		message: 'Incorrect phone number, must be between 7 & 13 digits',
	})
	phoneNumber?: string;
}
