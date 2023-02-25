import { PartialType } from '@nestjs/swagger';
import { CreateControlaccessTagDto } from './create-controlaccess-tag.dto';

export class UpdateControlaccessTagDto extends PartialType(CreateControlaccessTagDto) {}
