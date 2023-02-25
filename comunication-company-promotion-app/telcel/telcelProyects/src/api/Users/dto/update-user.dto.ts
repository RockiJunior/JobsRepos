import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Name of User',
  })
  name: string;
  // --------------------------------
  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Last Name (Father)',
  })
  firstLastName: string;
  // --------------------------------
  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Last Name (Mother)',
  })
  secondLastName: string;
  // --------------------------------
  @IsString()
  @IsEmail()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Email of User',
  })
  email: string;
  // --------------------------------
  // @IsString() => falta multer
  // @IsNotEmpty()
  // @ApiProperty()
  // Photo: string;
  // --------------------------------
  @IsString()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Alias or User Alias Name',
  })
  userName: string;
  // --------------------------------
  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  @IsNotEmpty()
  readonly phoneNumber: string;
  // --------------------------------
  @IsString()
  @IsOptional()
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description:
      'Plataformas Digitales | ComunicaciónContenidos | Distribuidor | Administrador',
  })
  role: string;
}
