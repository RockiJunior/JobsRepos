import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsValidUrl } from '../decorators/isValidUrl.decorator';
export class UploadCloudinaryDto {
	@ApiProperty({
		description: 'Multimedia of property',
		type: 'file',
		required: false,
	})
	file?: Express.Multer.File;

	@ApiProperty({
		description: 'Image type',
	})
	@IsNotEmpty({
		message: 'Enter the image type',
	})
	imageType: string;

	@ApiProperty({
		description: 'Url video',
		required: false,
	})
	@IsValidUrl({
		message: 'Url inválida',
	})
	video: string;

	@ApiProperty({
		description: 'Url 360-video',
		required: false,
	})
	@IsValidUrl({
		message: 'Url inválida',
	})
	video360: string;
}
