import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ClientEnumStatus } from '../../../../config/enum-types';
import { IsString } from '@nestjs/class-validator';
import { IsEqualTo } from '../../users/decorators/isEqualTo.decorator';
import { PhoneNumberDecorator } from '../../users/decorators/phoneNumber.decorator';

export class CreateClientDto {
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
		description: 'User status',
		default: ClientEnumStatus.active,
	})
	@IsOptional()
	status?: ClientEnumStatus;
}
