import { ApiProperty } from '@nestjs/swagger';

export class ImageProvider {
  @ApiProperty({ type: 'file', format: 'binary', required: true })
  image: Express.Multer.File[];
}
