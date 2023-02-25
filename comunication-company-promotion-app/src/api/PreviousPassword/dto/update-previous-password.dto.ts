import { PartialType } from '@nestjs/swagger';
import { CreatePreviousPasswordDto } from './create-previous-password.dto';

export class UpdatePreviousPasswordDto extends PartialType(CreatePreviousPasswordDto) {}
