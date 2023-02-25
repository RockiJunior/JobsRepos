import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Required Field' })
  @ApiProperty({
    description: 'Name of User',
  })
  readonly Name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Last Name (Father)',
  })
  readonly FirstLastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Last Name (Mother)',
  })
  readonly SecondLastName: string;

  // @IsString() => falta multer
  // @IsNotEmpty()
  // @ApiProperty()
  // Photo: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Email of User',
  })
  Email: string;

  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  @IsNotEmpty()
  PhoneNumber: string;

  Password: string;
}
