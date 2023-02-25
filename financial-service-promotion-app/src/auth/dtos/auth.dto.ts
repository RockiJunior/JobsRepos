import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Partner } from '../../common/database_entities/partner.entity';

import { User } from '../../api/users/entities/user.entity';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  @ApiProperty()
  readonly password: string;
}

export class LoginPartnerDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  @ApiProperty()
  readonly password: string;
}

export class LoginResponseDto {
  @IsString()
  readonly accessToken: string;

  @ApiProperty()
  readonly user: User;
}

export class LoginPartnerResponseDto {
  @IsString()
  readonly accessToken: string;
}
