import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateVideoDto {
  @ApiProperty({ type: 'file', format: 'binary', required: true })
  image?: Express.Multer.File[];

  @ApiProperty({ type: 'file', format: 'binary', required: true })
  video?: Express.Multer.File[];

  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Title of the video',
  })
  title: string;

  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Description of the video',
  })
  description: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Is Evaluation? true; else false',
    default: false,
  })
  evaluationVideo: boolean;

  @IsString()
  @IsNotEmpty({
    message: 'Required Field; Must be separated by colon',
  })
  @ApiProperty({
    description: 'Duration Must be with the following format: hh:mm:ss',
  })
  duration: string;
}
