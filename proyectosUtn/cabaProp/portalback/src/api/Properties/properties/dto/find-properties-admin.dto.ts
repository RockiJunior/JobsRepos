import { ApiProperty } from '@nestjs/swagger';
import { FindOptionsSort } from '../../../../config/enum-types';
import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FindPropertiesAdmin {
	
    @ApiProperty({
		description: 'Array of branch office IDs',
	})
	@IsArray()
	@Type(() => Number)
	branchOffices: number[];

	@ApiProperty({
		description: 'Property Type number for filter'
	})
	property: number;

	@ApiProperty({
		description: 'Operation Type number for filter'
	})
	operation: number;

	@ApiProperty({
		description: 'Status enum'
	})
	status: string;

	@ApiProperty()
	@IsOptional()
	sortBy?: {
		prop?: string;
		order?: FindOptionsSort;
	};

	@ApiProperty()
	finisheds: boolean;
}
