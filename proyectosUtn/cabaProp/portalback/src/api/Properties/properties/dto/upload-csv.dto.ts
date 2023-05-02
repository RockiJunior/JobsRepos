import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadCsvDto {
	@ApiProperty({
		type: 'file',
	})
	file: Express.Multer.File;

	@ApiProperty({
		description: 'Branch Office Id',
	})
	@IsNotEmpty({
		message:
			'Specify to which branch you want to load the properties - branchOfficeId',
	})
	branchOfficeId: number;
}
