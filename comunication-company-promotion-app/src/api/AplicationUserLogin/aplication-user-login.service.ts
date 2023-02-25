import { Injectable } from '@nestjs/common';
import { CreateAplicationUserLoginDto } from './dto/create-aplication-user-login.dto';
import { UpdateAplicationUserLoginDto } from './dto/update-aplication-user-login.dto';

@Injectable()
export class AplicationUserLoginService {
  create(createAplicationUserLoginDto: CreateAplicationUserLoginDto) {
    return 'This action adds a new aplicationUserLogin';
  }

  findAll() {
    return `This action returns all aplicationUserLogin`;
  }

  findOne(id: string) {
    return `This action returns a #${id} aplicationUserLogin`;
  }

  update(
    id: string,
    updateAplicationUserLoginDto: UpdateAplicationUserLoginDto,
  ) {
    return `This action updates a #${id} aplicationUserLogin`;
  }

  remove(id: number) {
    return `This action removes a #${id} aplicationUserLogin`;
  }
}
