import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty} from 'class-validator';
import {
	IsEmail,
	IsOptional,
	IsString,
	Length,
} from '@nestjs/class-validator';
import { IsDniValid } from '../decorators/isDniValid.decorator';
import { UserEnumStatus } from 'src/config/enum-types';
import { PhoneNumberDecorator } from '../decorators/phoneNumber.decorator';

export class UpdateUserDataDto {
	@ApiProperty({
		description: 'User name',
	})
	@IsNotEmpty({
		message: 'Please enter a user name',
	})
	@IsOptional()
	@IsString()
	@Length(1, 30, { message: 'Invalid first name' })
	firstName?: string;

	@ApiProperty({
		description: 'User lastName',
	})
	@IsNotEmpty({
		message: 'Please enter a user lastName',
	})
	@IsOptional()
	@IsString()
	@Length(1, 40, { message: 'Invalid last name' })
	lastName?: string;

	@ApiProperty({
		description: 'User email',
	})
	@IsOptional()
	@IsNotEmpty({
		message: 'Please enter the user email',
	})
	@IsEmail()
	email?: string;

	@ApiProperty({
		description: 'User phone number',
	})
	@PhoneNumberDecorator({
		message: 'Incorrect phone number, must be at between 7 & 13 digits',
	})
	@IsOptional()
	phoneNumber?: string;

	@ApiProperty({
		description: 'User Dni',
	})
	@IsOptional()
	@IsNotEmpty({
		message: 'Please enter a DNI',
	})
	@IsDniValid({
		message: 'Please enter a valid DNI',
	})
	dni?: string;

	@ApiProperty({
		description: 'User Status',
	})
	@IsOptional()
	@IsEnum(UserEnumStatus)
	status?: UserEnumStatus;
}
