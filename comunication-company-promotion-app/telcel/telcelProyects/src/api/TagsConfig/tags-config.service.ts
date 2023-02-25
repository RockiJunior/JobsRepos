import { Injectable } from '@nestjs/common';
import { CreateTagsConfigDto } from './dto/create-tags-config.dto';
import { UpdateTagsConfigDto } from './dto/update-tags-config.dto';

@Injectable()
export class TagsConfigService {
  create(createTagsConfigDto: CreateTagsConfigDto) {
    return 'This action adds a new tagsConfig';
  }

  findAll() {
    return `This action returns all tagsConfig`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tagsConfig`;
  }

  update(id: number, updateTagsConfigDto: UpdateTagsConfigDto) {
    return `This action updates a #${id} tagsConfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} tagsConfig`;
  }
}
