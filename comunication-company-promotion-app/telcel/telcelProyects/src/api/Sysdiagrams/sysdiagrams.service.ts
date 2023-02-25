import { Injectable } from '@nestjs/common';
import { CreateSysdiagramDto } from './dto/create-sysdiagram.dto';
import { UpdateSysdiagramDto } from './dto/update-sysdiagram.dto';

@Injectable()
export class SysdiagramsService {
  create(createSysdiagramDto: CreateSysdiagramDto) {
    return 'This action adds a new sysdiagram';
  }

  findAll() {
    return `This action returns all sysdiagrams`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sysdiagram`;
  }

  update(id: number, updateSysdiagramDto: UpdateSysdiagramDto) {
    return `This action updates a #${id} sysdiagram`;
  }

  remove(id: number) {
    return `This action removes a #${id} sysdiagram`;
  }
}
