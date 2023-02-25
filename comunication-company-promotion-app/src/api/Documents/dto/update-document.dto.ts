import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { FileDocument } from './file-document.dto';

export class UpdateDocumentDto {
  @ApiProperty({ type: 'file', format: 'binary', required: true })
  file: FileDocument;

  @IsBoolean()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Is Evaluation? true; else false',
  })
  evaluation: boolean;
}
