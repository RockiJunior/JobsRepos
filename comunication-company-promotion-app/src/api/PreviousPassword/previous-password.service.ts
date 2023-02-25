import { Injectable } from '@nestjs/common';
import { CreatePreviousPasswordDto } from './dto/create-previous-password.dto';
import { UpdatePreviousPasswordDto } from './dto/update-previous-password.dto';

@Injectable()
export class PreviousPasswordService {
  create(createPreviousPasswordDto: CreatePreviousPasswordDto) {
    return 'This action adds a new previousPassword';
  }

  findAll() {
    return `This action returns all previousPassword`;
  }

  findOne(id: number) {
    return `This action returns a #${id} previousPassword`;
  }

  update(id: number, updatePreviousPasswordDto: UpdatePreviousPasswordDto) {
    return `This action updates a #${id} previousPassword`;
  }

  remove(id: number) {
    return `This action removes a #${id} previousPassword`;
  }
}
