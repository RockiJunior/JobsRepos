import { Injectable } from '@nestjs/common';
import { CreateControlaccessdateDto } from './dto/create-controlaccessdate.dto';
import { UpdateControlaccessdateDto } from './dto/update-controlaccessdate.dto';

@Injectable()
export class ControlaccessdatesService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createControlaccessdateDto: CreateControlaccessdateDto) {
    return 'This action adds a new controlaccessdate';
  }

  findAll() {
    return `This action returns all controlaccessdates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} controlaccessdate`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateControlaccessdateDto: UpdateControlaccessdateDto) {
    return `This action updates a #${id} controlaccessdate`;
  }

  remove(id: number) {
    return `This action removes a #${id} controlaccessdate`;
  }
}
