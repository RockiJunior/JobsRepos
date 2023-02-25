import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'name or description of the course',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  name: string;
}
