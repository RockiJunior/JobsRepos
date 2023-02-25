import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Matches } from 'class-validator';
import { EnumCourseTypes, EnumStatusTypes } from 'src/common/constants';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({ message: 'Campo requerido' })
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty({ message: 'Campo requerido' })
  @IsUrl({}, { message: 'Debes ingresar una url válida.' })
  @ApiProperty()
  readonly url: string;

  @IsString()
  @IsNotEmpty({ message: 'Campo requerido' })
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Formato incorrecto' })
  @ApiProperty()
  readonly createDate: string;

  @IsDate()
  @IsNotEmpty({ message: 'Campo requerido' })
  @ApiProperty()
  readonly validityDate: Date;

  @IsNotEmpty()
  @IsEnum(EnumStatusTypes, { message: 'Status incorrecto' })
  @ApiProperty({ enum: EnumStatusTypes })
  readonly status: EnumStatusTypes;

  @IsNotEmpty()
  @IsEnum(EnumCourseTypes, { message: 'Valor incorrecto' })
  @ApiProperty({ enum: EnumCourseTypes })
  readonly type: EnumCourseTypes;

  @IsBoolean()
  readonly initial: boolean;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
