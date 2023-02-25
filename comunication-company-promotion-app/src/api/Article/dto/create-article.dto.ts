import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Title of the article',
  })
  title: string;

  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Author of the article',
  })
  author: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Category of the article',
  })
  category?: string;

  @IsBoolean()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Author of the article',
  })
  evaluationArticle: boolean;

  @ApiProperty({
    type: 'file',
    format: 'binary',
    required: true,
    description: 'image to upload',
  })
  image: Express.Multer.File[];

  @IsString()
  @IsNotEmpty({
    message: 'Required Field; Must be separated by colon',
  })
  @ApiProperty({
    description: 'Duration Must be with the following format: hh:mm:ss',
  })
  duration: string;
}
