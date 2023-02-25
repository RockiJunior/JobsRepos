import { PartialType } from '@nestjs/swagger';
import { CreateControlaccessDto } from './create-controlaccess.dto';

export class UpdateControlaccessDto extends PartialType(CreateControlaccessDto) {}
