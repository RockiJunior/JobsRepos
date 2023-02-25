import { Injectable } from '@nestjs/common';
import { CreateControlaccessTagDto } from './dto/create-controlaccess-tag.dto';
import { UpdateControlaccessTagDto } from './dto/update-controlaccess-tag.dto';

@Injectable()
export class ControlaccessTagService {
  create(createControlaccessTagDto: CreateControlaccessTagDto) {
    return 'This action adds a new controlaccessTag';
  }

  findAll() {
    return `This action returns all controlaccessTag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} controlaccessTag`;
  }

  update(id: number, updateControlaccessTagDto: UpdateControlaccessTagDto) {
    return `This action updates a #${id} controlaccessTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} controlaccessTag`;
  }
}
