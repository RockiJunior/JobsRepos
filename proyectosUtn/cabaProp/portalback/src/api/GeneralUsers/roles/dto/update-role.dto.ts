// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
	@ApiProperty({
		description: 'Role Id',
	})
	@IsNotEmpty({
		message: 'Please enter the role Id',
	})
	roleId: number;
}
