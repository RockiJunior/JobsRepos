import { ApiProperty } from '@nestjs/swagger';
import {IsOptional} from 'class-validator';

export class UpdateUserRolesDto {
	@ApiProperty({
		description: 'Branch office id',
	})
	@IsOptional()
	branchOfficeId?: number;

	@ApiProperty({
		description: 'Role id',
	})
	@IsOptional()
	roleId?: number;

	@ApiProperty({
		description: 'Is active ? true : false',
	})
	@IsOptional()
	active?: boolean;
}
