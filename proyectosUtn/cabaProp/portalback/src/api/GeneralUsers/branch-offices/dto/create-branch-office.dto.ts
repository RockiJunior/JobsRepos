import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchOfficeDto {
	@ApiProperty({
		description: 'Branch Office name',
	})
	@IsNotEmpty({
		message: 'Please enter a branch-office name',
	})
	branchOfficeName: string;

	@ApiProperty({
		description: 'Real Estate Id',
	})
	@IsNotEmpty({
		message: 'Please enter a real estate Id,',
	})
	realEstateId: number;
}
