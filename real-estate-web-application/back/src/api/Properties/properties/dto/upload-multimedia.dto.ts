import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsValidUrl } from '../decorators/isValidUrl.decorator';

export class UploadMultimediaDto {
	@ApiProperty({
		description: 'Multimedia of property',
		type: 'file',
		required: false,
	})
	@IsOptional()
	image?: Express.Multer.File[];

	@ApiProperty({
		description: 'Property maps',
		type: 'file',
		required: false,
	})
	@IsOptional()
	houseMap: Express.Multer.File[];

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
