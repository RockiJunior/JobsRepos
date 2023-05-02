import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { UserEnumStatus } from 'src/config/enum-types';
import { BranchOfficeArr } from './branch-office-arr.dto';
import { TypeOfUser } from '../../../../config/enum-types';
import { IsDniValid } from '../decorators/isDniValid.decorator';
import { PhoneNumberDecorator } from '../decorators/phoneNumber.decorator';

export class CreateUserDto {
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
		description: 'User status',
		default: UserEnumStatus.pending,
	})
	@IsOptional()
	status?: UserEnumStatus;

	@ApiProperty({
		description: 'Phone number of user',
	})
	@IsOptional()
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
		default: TypeOfUser.collabUser,
	})
	@IsOptional()
	typeOfUser: TypeOfUser;

	@ApiProperty({
		description: 'Branch offices id list',
		type: BranchOfficeArr,
		isArray: true,
	})
	@IsOptional()
	branchOffices: [];
}
