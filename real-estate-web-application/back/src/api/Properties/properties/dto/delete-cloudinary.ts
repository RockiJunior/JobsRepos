import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCloudinaryDto {
	@ApiProperty({
		description: 'image url to delete',
	})
	@IsString()
	fileUrl: string;
}
