import { ApiProperty } from '@nestjs/swagger';
import { AlertEnumTypes } from '../../../../config/enum-types';

export class SearchAlertDto {
	@ApiProperty({
		description: 'Search Enum Alert',
		type: AlertEnumTypes,
	})
	alert: AlertEnumTypes;
}
