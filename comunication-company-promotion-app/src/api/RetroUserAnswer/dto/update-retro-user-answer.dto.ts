import { PartialType } from '@nestjs/swagger';
import { CreateRetroUserAnswerDto } from './create-retro-user-answer.dto';

export class UpdateRetroUserAnswerDto extends PartialType(CreateRetroUserAnswerDto) {}
