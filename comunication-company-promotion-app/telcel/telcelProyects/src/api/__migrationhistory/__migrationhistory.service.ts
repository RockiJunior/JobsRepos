import { Injectable } from '@nestjs/common';
import { CreateMigrationhistoryDto } from './dto/create-__migrationhistory.dto';
import { UpdateMigrationhistoryDto } from './dto/update-__migrationhistory.dto';

@Injectable()
export class MigrationhistoryService {
  create(createMigrationhistoryDto: CreateMigrationhistoryDto) {
    return 'This action adds a new migrationhistory';
  }

  findAll() {
    return `This action returns all migrationhistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} migrationhistory`;
  }

  update(id: number, updateMigrationhistoryDto: UpdateMigrationhistoryDto) {
    return `This action updates a #${id} migrationhistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} migrationhistory`;
  }
}
