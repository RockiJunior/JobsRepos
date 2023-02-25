import { ApiProperty } from '@nestjs/swagger';

export class FileArticle {
  @ApiProperty({ type: 'file', format: 'binary', required: true })
  image: Express.Multer.File[];
}
