import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { IsEqualTo } from 'src/common/decorators/is-equal-to.validator.decorator';

export class UserRegisterDto {
  @IsNotEmpty({
    message: 'Required Field',
  })
  @IsString()
  @ApiProperty({
    description: 'Name of User',
  })
  readonly name: string;
  // --------------------------------
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Last Name (Father)',
  })
  readonly firstLastName: string;
  // --------------------------------
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Last Name (Mother)',
  })
  readonly secondLastName: string;
  // --------------------------------
  @IsEmail({}, { message: 'Invalid Email' })
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Email of User',
  })
  readonly email: string;
  // --------------------------------
  //Añadir regex según parámetros de contraseña
  @IsString()
  @Length(8, 20, { message: 'Invalid Password' })
  @IsNotEmpty({
    message: 'Required Field',
  })
  @ApiProperty({
    description: 'Password',
  })
  readonly password: string;
  // --------------------------------
  @IsEqualTo('password', { message: 'Both password need to be Equals' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Confirm password',
  })
  readonly confirmPassword: string;
  // --------------------------------
  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  @IsNotEmpty()
  readonly phoneNumber: string;
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
    description:
      'Plataformas Digitales | ComunicaciónContenidos | Distribuidor | Administrador',
  })
  readonly role: string;

  @ApiProperty({ type: 'file', required: false })
  readonly photo: Express.Multer.File[];
}
