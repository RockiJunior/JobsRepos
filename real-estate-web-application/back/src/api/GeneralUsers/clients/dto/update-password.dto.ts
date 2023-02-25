import { IsString } from '@nestjs/class-validator';
import { Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEqualTo } from '../../users/decorators/isEqualTo.decorator';
export class UpdatePasswordDto {
	//Añadir regex según parámetros de contraseña
	@ApiProperty({
		description: 'Actual Password',
	})
	@IsString()
	@Length(8, 20, { message: 'Contraseña incorrecta' })
	@IsOptional()
	actualPassword?: string;

	@ApiProperty({
		description: 'Password',
	})
	@IsString()
	@Length(8, 20, { message: 'Contraseña incorrecta' })
	@IsOptional()
	newPassword?: string;

	// --------------------------------
	@ApiProperty({
		description: 'Confirm your password',
	})
	@IsOptional()
	@IsEqualTo('newPassword', { message: 'Ambas contraseñas deben ser iguales' })
	confirmPassword?: string;
}
