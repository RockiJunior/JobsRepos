import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
	@ApiProperty({
		description: 'Role name',
	})
	@IsNotEmpty({
		message: 'Please enter the role name',
	})
	@IsString()
	name: string;

	@ApiProperty({
		description: 'List of permissions id',
		type: Number,
		isArray: true,
	})
	@IsNotEmpty({
		message: 'Please enter the permission ids in a list',
	})
	permissionIds: [];
}
