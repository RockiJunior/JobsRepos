import { IsEnum } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyEnumStatus } from '../../../../config/enum-types';

export class PropertyPublishedStatusDto {
	@ApiProperty({
		description: 'published status',
		example: [
			PropertyEnumStatus.finished,
			PropertyEnumStatus.paused,
			PropertyEnumStatus.published,
		],
	})
	@IsEnum(PropertyEnumStatus)
	status!: PropertyEnumStatus;
}
