import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BranchOfficeArr {
	@ApiProperty({
		description: 'Branch Office Id',
	})
	@IsNotEmpty({
		message: 'Please enter branch office id',
	})
	branchOfficeId: number;

	@ApiProperty({
		description: 'Is active? true; else false',
	})
	@IsNotEmpty({
		message: 'Enter a boolean value for active field',
	})
	active: boolean;

	@ApiProperty({
		description: 'Role Id',
	})
	@IsNotEmpty({
		message: 'Please enter a Role id',
	})
	roleId: number;
}
