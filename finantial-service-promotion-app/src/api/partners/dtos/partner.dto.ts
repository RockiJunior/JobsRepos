import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsOptional,
  IsAlphanumeric,
  IsNumberString,
  Matches,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEqualTo } from 'src/common/decorators/is-equal-to.validator.decorator';
import { EnumCoursesStatus, EnumFilesStatusPatch } from 'src/common/constants';
import { AsociadoStatus } from '../../../common/constants';
import { IsDate } from 'class-validator';

const REGEX_VALID_NAME = /^[a-zA-Z0-9À-ÿ\u00f1\u00d1]+(\s*[a-zA-Z0-9À-ÿ\u00f1\u00d1]*)*[a-zA-Z0-9À-ÿ\u00f1\u00d1]+$/;

export class CreatePartnerDto {
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly email: string;

  @IsString()
  @Length(8, 1000, { message: 'Contraseña inválida' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly password: string;

  @IsEqualTo('password', { message: 'Ambas contraseñas deben ser iguales' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly passwordConfirmation: string;

  @IsString()
  @IsOptional()
  readonly referencedCode: string;
}

export class UpdatePartnerDto {
  @IsOptional()
  @Matches(REGEX_VALID_NAME, { message: 'Campo inválido' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly name: string;

  @IsOptional()
  @Matches(REGEX_VALID_NAME, { message: 'Campo inválido' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly lastName: string;

  @IsOptional()
  @Matches(REGEX_VALID_NAME, { message: 'Campo inválido' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly motherLastName: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Campo requerido' })
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Formato incorrecto' })
  readonly birthDate: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly nationality: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly birthPlace: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Edad inválida' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly age: string;

  @IsOptional()
  @IsAlphanumeric('en-US', { message: 'RFC inválido' })
  @Length(13, 13, { message: 'RFC inválido' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly rfc: string;

  @IsOptional()
  @IsAlphanumeric('en-US', { message: 'CURP inválido' })
  @Length(18, 18, { message: 'CURP inválido' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly curp: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly civilStatus: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly gender: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly mobileNumber: string;

  @IsOptional()
  @Matches(REGEX_VALID_NAME, { message: 'Campo inválido' })
  readonly street: string;

  @IsOptional()
  @IsString()
  @Matches(REGEX_VALID_NAME, { message: 'Campo inválido' })
  readonly externalNumber: string;

  @IsOptional()
  readonly internalNumber: string;

  @IsOptional()
  @IsString()
  @Matches(REGEX_VALID_NAME, { message: 'Campo inválido' })
  colony: string;

  @IsOptional()
  @IsString()
  @Matches(REGEX_VALID_NAME, { message: 'Campo inválido' })
  municipality: string;

  @IsOptional()
  @Matches(REGEX_VALID_NAME, { message: 'Campo inválido' })
  state: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Código postal inválido' })
  @Length(5, 5, { message: 'Código postal inválido' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly zipcode: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Cuenta CLABE inválida' })
  @Length(17, 18, { message: 'Cuenta CLABE inválida' })
  @IsNotEmpty({ message: 'Campo requerido' })
  clabe: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Seleccione el Banco' })
  bank: string;

  @IsOptional()
  @Length(11, 11, { message: 'Cuenta inválida' })
  @IsNotEmpty({ message: 'Campo requerido' })
  accountNumber: string;
}

export class UpdatePartnerFilesDto {
  @ApiProperty({ type: 'file' })
  readonly ineFront?: Express.Multer.File[];

  @ApiProperty({ type: 'file' })
  readonly ineBack?: Express.Multer.File[];

  @ApiProperty({ type: 'file' })
  readonly rfc?: Express.Multer.File[];

  @ApiProperty({ type: 'file' })
  readonly curp?: Express.Multer.File[];

  @ApiProperty({ type: 'file' })
  readonly proofOfAddress?: Express.Multer.File[];

  @ApiProperty({ type: 'file' })
  readonly billingStatement?: Express.Multer.File[];

  @ApiProperty({ type: 'file' })
  readonly signature?: Express.Multer.File[];

  @ApiProperty({ type: 'file' })
  readonly profilePhoto?: Express.Multer.File[];

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly affiliationContract: Boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly privacyNotice: Boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly confidentialityNotice: Boolean;
}

export class VerificationTokenDto {
  @IsNumberString({}, { message: 'Datos inválidos' })
  @Length(3, 6, { message: 'Código inválido' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly verificationToken: string;

  @IsNotEmpty({ message: 'Campo requerido' })
  readonly email: string;
}

export class RecoveryPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly recoveryToken: string;

  @IsString()
  @Length(8, 1000, { message: 'Contraseña inválida' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly password: string;

  @IsEqualTo('password', { message: 'Ambas contraseñas deben ser iguales' })
  @IsNotEmpty({ message: 'Campo requerido' })
  readonly passwordConfirmation: string;
}

export class SendVerificationTokenDto {
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  readonly email: string;
}

export class SendRecoveryPasswordTokenDto {
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  readonly email: string;
}

export class UpdatePartnerFileStatusDto {
  @IsNotEmpty({ message: 'Campo requerido' })
  @IsEnum(EnumFilesStatusPatch)
  status: EnumFilesStatusPatch;

  @IsOptional()
  rejectedStatus: string;
}

export class UpdateCoursesStatusDto {
  @IsNotEmpty({ message: 'Status requerido' })
  @IsEnum(EnumCoursesStatus)
  status: EnumCoursesStatus;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNotEmpty({ message: 'Fecha requerida.' })
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Formato de fecha incorrecto' })
  @IsString()
  evaluationDate?: string;

  @IsNotEmpty({ message: 'Score requerido.' })
  @IsNumber()
  score: number;
}

export class UpdateBankAccountDTO {
  @IsNotEmpty({ message: 'Debe enviar un nombre.' })
  @IsString()
  bank: string;

  @IsNotEmpty({ message: 'Debe enviar un número de cuenta.' })
  @IsString()
  accountNumber: string;

  @IsNotEmpty({ message: 'Debe enviar su clabe.' })
  @IsString()
  @Length(18)
  clabe: string;
}

export class UpdateBankAccountFileDTO {
  @ApiProperty({ type: 'file' })
  readonly bankAccount?: Express.Multer.File[];
}

export class RejectPartnerDto {
  @IsNotEmpty({ message: 'Motivo requerido' })
  @IsString()
  rejectedReason: string;
}
