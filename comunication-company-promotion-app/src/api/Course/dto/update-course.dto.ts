import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty({
    description: 'Name of the course to update',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  name: string;
}
