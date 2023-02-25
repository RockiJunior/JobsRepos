import { Injectable } from '@nestjs/common';
import { CreateOldUserPasswordDto } from './dto/create-old-user-password.dto';
import { UpdateOldUserPasswordDto } from './dto/update-old-user-password.dto';

@Injectable()
export class OldUserPasswordService {
  create(createOldUserPasswordDto: CreateOldUserPasswordDto) {
    return 'This action adds a new oldUserPassword';
  }

  findAll() {
    return `This action returns all oldUserPassword`;
  }

  findOne(id: number) {
    return `This action returns a #${id} oldUserPassword`;
  }

  update(id: number, updateOldUserPasswordDto: UpdateOldUserPasswordDto) {
    return `This action updates a #${id} oldUserPassword`;
  }

  remove(id: number) {
    return `This action removes a #${id} oldUserPassword`;
  }
}
