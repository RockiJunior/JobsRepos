import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProviderDto {
  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Name of the document',
  })
  name: string;

  @ApiProperty({ type: 'file', format: 'binary', required: true })
  image?: Express.Multer.File[];
}
