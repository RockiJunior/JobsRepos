import { PartialType } from '@nestjs/swagger';
import { CreateTestUserAnswerDto } from './create-test-user-answer.dto';

export class UpdateTestUserAnswerDto extends PartialType(CreateTestUserAnswerDto) {}
