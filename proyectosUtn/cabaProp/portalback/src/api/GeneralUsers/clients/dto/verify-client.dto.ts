import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IsEqualTo } from '../../users/decorators/isEqualTo.decorator';
export class VerifyClientDto {
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
		description: 'Verification token ',
	})
	@IsNotEmpty({
		message: 'Please enter the verification token',
	})
	@IsString()
	token: string;
}
