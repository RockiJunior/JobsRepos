import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';
import { Repository } from 'typeorm';
import { ImageProvider } from './dto/image-provider.dto';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
  ) {}

  async create(image: ImageProvider, data: CreateProviderDto, user: any) {
    const imageName = parseInt(
      `${Math.floor(100000 + Math.random() * 900000)}` +
        `${Math.floor(100000 + Math.random() * 900000)}`,
    );
    if (!image) {
      throw new BadRequestException(
        'Bad Request',
        'Se necesitan enviar la imagen',
      );
    }
    const provider = this.providerRepository.create({
      IdProvider: uuid(),
      Name: data.name,
      ImageUrl: `${imageName}.png`,
      Created: moment().utc().format(),
    });
    await this.providerRepository.save(provider);
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  async findAll() {
    const providers = await this.providerRepository.find({});
    return providers;
  }

  findOne(id: number) {
    return `This action returns a #${id} provider`;
  }

  update(id: number, updateProviderDto: UpdateProviderDto) {
    return `This action updates a #${id} provider`;
  }

  remove(id: number) {
    return `This action removes a #${id} provider`;
  }
}
