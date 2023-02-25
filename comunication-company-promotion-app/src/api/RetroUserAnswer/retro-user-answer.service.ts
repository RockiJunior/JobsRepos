import { Injectable } from '@nestjs/common';
import { CreateRetroUserAnswerDto } from './dto/create-retro-user-answer.dto';
import { UpdateRetroUserAnswerDto } from './dto/update-retro-user-answer.dto';

@Injectable()
export class RetroUserAnswerService {
  create(createRetroUserAnswerDto: CreateRetroUserAnswerDto) {
    return 'This action adds a new retroUserAnswer';
  }

  findAll() {
    return `This action returns all retroUserAnswer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} retroUserAnswer`;
  }

  update(id: number, updateRetroUserAnswerDto: UpdateRetroUserAnswerDto) {
    return `This action updates a #${id} retroUserAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} retroUserAnswer`;
  }
}
