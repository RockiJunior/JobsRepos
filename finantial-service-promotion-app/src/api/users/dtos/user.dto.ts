import { IsString, IsNotEmpty, IsEmail, Length, IsOptional } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Campo requerido' })
  @ApiProperty({ description: 'the name of user' })
  readonly name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Campo requerido' })
  @ApiProperty({ description: 'the email of user' })
  readonly email: string;

  @IsOptional()
  @IsString()
  @Length(8)
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Campo requerido' })
  @ApiProperty({ description: 'the role of user' })
  readonly role: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
