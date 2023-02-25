import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
} from 'class-validator';
import { UserEnumStatus } from 'src/config/enum-types';
import { BranchOfficeArr } from './branch-office-arr.dto';
import { TypeOfUser } from '../../../../config/enum-types';
import { IsEqualTo } from '../decorators/isEqualTo.decorator';
import { IsDniValid } from '../decorators/isDniValid.decorator';
import { PhoneNumberDecorator } from '../decorators/phoneNumber.decorator';

export class CreateAdminDto {
	@ApiProperty({
		description: 'User name',
	})
	@IsNotEmpty({
		message: 'Please enter a user name',
	})
	@IsString()
	@Length(1, 30, { message: 'Invalid first name' })
	firstName: string;

	@ApiProperty({
		description: 'User lastName',
	})
	@IsNotEmpty({
		message: 'Please enter a user lastName',
	})
	@IsString()
	@Length(1, 40, { message: 'Invalid last name' })
	lastName: string;

	@ApiProperty({
		description: 'User email',
	})
	@IsNotEmpty({
		message: 'Please enter a user lastName',
	})
	email: string;

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

	@ApiProperty({
		description: 'User status',
		default: UserEnumStatus.pending,
	})
	@IsOptional()
	status?: UserEnumStatus;

	@ApiProperty({
		description: 'Phone number of user',
	})
	@IsNotEmpty({
		message: 'Please enter a phone user number',
	})
	@PhoneNumberDecorator({
		message: 'Incorrect phone number, must be at between 7 & 13 digits',
	})
	phoneNumber: string;

	@ApiProperty({
		description: 'Dni of user',
	})
	@IsNotEmpty({
		message: 'Please enter Dni of user',
	})
	@IsDniValid()
	dni: string;

	@ApiProperty({
		description: 'User status',
		default: TypeOfUser.adminUser,
	})
	@IsOptional()
	typeOfUser: TypeOfUser;
}
