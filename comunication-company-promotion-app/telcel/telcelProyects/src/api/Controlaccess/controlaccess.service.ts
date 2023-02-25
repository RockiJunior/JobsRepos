import { Injectable } from '@nestjs/common';
import { CreateControlaccessDto } from './dto/create-controlaccess.dto';
import { UpdateControlaccessDto } from './dto/update-controlaccess.dto';

@Injectable()
export class ControlaccessService {
  create(createControlaccessDto: CreateControlaccessDto) {
    return 'This action adds a new controlaccess';
  }

  findAll() {
    return `This action returns all controlaccess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} controlaccess`;
  }

  update(id: number, updateControlaccessDto: UpdateControlaccessDto) {
    return `This action updates a #${id} controlaccess`;
  }

  remove(id: number) {
    return `This action removes a #${id} controlaccess`;
  }
}
