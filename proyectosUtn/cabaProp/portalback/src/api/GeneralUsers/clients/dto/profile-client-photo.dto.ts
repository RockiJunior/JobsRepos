import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadProfileClientPhotoDto {
	@ApiProperty({
		description: 'Client profile photo',
		type: 'file',
		required: false,
	})
	@IsOptional()
	photo?: Express.Multer.File[];
}
