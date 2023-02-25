import { Injectable } from '@nestjs/common';
import { CreateTestUserAnswerDto } from './dto/create-test-user-answer.dto';
import { UpdateTestUserAnswerDto } from './dto/update-test-user-answer.dto';

@Injectable()
export class TestUserAnswerService {
  create(createTestUserAnswerDto: CreateTestUserAnswerDto) {
    return 'This action adds a new testUserAnswer';
  }

  findAll() {
    return `This action returns all testUserAnswer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testUserAnswer`;
  }

  update(id: number, updateTestUserAnswerDto: UpdateTestUserAnswerDto) {
    return `This action updates a #${id} testUserAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} testUserAnswer`;
  }
}
