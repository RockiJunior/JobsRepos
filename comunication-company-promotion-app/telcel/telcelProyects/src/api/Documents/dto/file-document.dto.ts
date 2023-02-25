import { ApiProperty } from '@nestjs/swagger';

export class FileDocument {
  @ApiProperty({ type: 'file', format: 'binary', required: true })
  file: Express.Multer.File[];
}
