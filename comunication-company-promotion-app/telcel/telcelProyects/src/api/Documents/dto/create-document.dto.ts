import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileDocument } from './file-document.dto';

export class CreateDocumentDto {
  @ApiProperty({ type: 'file', format: 'binary', required: true })
  file: FileDocument;

  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Name of the document',
  })
  name: string;

  @IsNumber()
  @IsOptional({
    message: 'If field is empty, default value is 0',
  })
  @ApiProperty({
    description:
      '0: Amigo, 1: Planes Telcel, 3: Soluciones Telcel, 4: Internet Telcel, 5: Dispositivos, ',
  })
  type: number;

  @IsBoolean()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Is evaluation? true; else false',
  })
  evaluation: boolean;
}
