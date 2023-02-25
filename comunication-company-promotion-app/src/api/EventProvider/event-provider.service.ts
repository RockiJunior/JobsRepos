import { Injectable } from '@nestjs/common';
import { CreateEventProviderDto } from './dto/create-event-provider.dto';
import { UpdateEventProviderDto } from './dto/update-event-provider.dto';

@Injectable()
export class EventProviderService {
  create(createEventProviderDto: CreateEventProviderDto) {
    return 'This action adds a new eventProvider';
  }

  findAll() {
    return `This action returns all eventProvider`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventProvider`;
  }

  update(id: number, updateEventProviderDto: UpdateEventProviderDto) {
    return `This action updates a #${id} eventProvider`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventProvider`;
  }
}
