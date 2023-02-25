import { PartialType } from '@nestjs/swagger';
import { CreateControlaccessdateDto } from './create-controlaccessdate.dto';

export class UpdateControlaccessdateDto extends PartialType(
  CreateControlaccessdateDto,
) {}
