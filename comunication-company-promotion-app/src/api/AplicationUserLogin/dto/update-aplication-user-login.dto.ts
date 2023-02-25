import { PartialType } from '@nestjs/swagger';
import { CreateAplicationUserLoginDto } from './create-aplication-user-login.dto';

export class UpdateAplicationUserLoginDto extends PartialType(CreateAplicationUserLoginDto) {}
