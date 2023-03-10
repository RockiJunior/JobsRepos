import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadProfileUserPhotoDto {
	@ApiProperty({
		description: 'User profile photo',
		type: 'file',
		required: false,
	})
	@IsOptional()
	photo?: Express.Multer.File[];
}
