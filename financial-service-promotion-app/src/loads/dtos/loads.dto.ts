import { ApiProperty } from '@nestjs/swagger';

export class LoadPartnersDto {
  @ApiProperty({ type: 'file' })
  readonly file: Express.Multer.File[];
}

export class LoadCourseToPartnerDto {
  @ApiProperty({ type: 'file' })
  readonly file: Express.Multer.File[];
}

export class LoadsDto {
  @ApiProperty({ type: 'file' })
  readonly file: Express.Multer.File[];
}
