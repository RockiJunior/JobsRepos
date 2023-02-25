import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IsEqualTo } from 'src/common/decorators/is-equal-to.validator.decorator';

export class ChangePasswordDto {
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
  password: string;
  // --------------------------------
  @IsEqualTo('password', { message: 'Both password need to be Equals' })
  @IsNotEmpty()
  confirmPassword: string;
}
