import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePodcastDto {
  @ApiProperty({ type: 'file', format: 'binary', required: true })
  image?: Express.Multer.File[];

  @ApiProperty({ type: 'file', format: 'binary', required: true })
  audio?: Express.Multer.File[];

  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Name of the document',
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the document',
  })
  description: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Is Evaluation? true; else false',
    default: false,
  })
  evaluationPodcast: boolean;

  @IsString()
  @IsNotEmpty({
    message: 'Required Field; Must be separated by colon',
  })
  @ApiProperty({
    description: 'Duration Must be with the following format: hh:mm:ss',
  })
  duration: string;
}
