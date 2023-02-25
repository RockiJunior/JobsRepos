import { PartialType } from '@nestjs/swagger';
import { CreateOldUserPasswordDto } from './create-old-user-password.dto';

export class UpdateOldUserPasswordDto extends PartialType(CreateOldUserPasswordDto) {}
