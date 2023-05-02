import { IsUUID } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IsEqualTo } from '../../users/decorators/isEqualTo.decorator';

export class ValidateUserDto {
	// --------------------------------
	//Añadir regex según parámetros de contraseña
	@IsString()
	@Length(8, 20, { message: 'Incorrect Password' })
	@IsNotEmpty({
		message: 'Required Field',
	})
	@ApiProperty({
		description: 'Password',
	})
	password: string;

	// --------------------------------
	@ApiProperty({
		description: 'Required Field',
	})
	@IsNotEmpty({
		message: 'Please confirm your password',
	})
	@IsEqualTo('password', { message: 'Both password need to be Equals' })
	confirmPassword: string;

	// --------------------------------
	@ApiProperty({
		description: 'uuid Token authorization',
	})
	@IsNotEmpty({
		message: 'Please enter your uuid token',
	})
	@IsUUID()
	token: string;
}
