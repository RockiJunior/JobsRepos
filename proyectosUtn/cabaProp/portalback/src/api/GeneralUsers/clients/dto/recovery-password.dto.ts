import { IsString, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEqualTo } from '../../users/decorators/isEqualTo.decorator';


export class RecoveryPasswordDto {
	@ApiProperty({
		description: 'Recovery token',
	})
	@IsNotEmpty({
		message: 'Please enter your recovery token',
	})
	recoveryToken: string;
	
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
}
