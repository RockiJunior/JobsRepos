import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCampaingDto } from './dto/create-campaing.dto';
import { UpdateCampaingDto } from './dto/update-campaing.dto';
import { Campaing } from './entities/campaing.entity';
import { Repository } from 'typeorm';
import { CampaingDocument } from './entities/campaingDocument.entity';
import * as moment from 'moment';

@Injectable()
export class CampaingService {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
    @InjectRepository(CampaingDocument)
    private readonly campaingDocumentRepository: Repository<CampaingDocument>,
  ) {}

  async create(createCampaingDto: CreateCampaingDto) {
    return 'This action adds a new campaing';
  }

  async findByStatus() {
    // TODO: corregir este endpoint para que traiga la campaña por status
    const campaingFinded = await this.campaingRepository.find({});
    return campaingFinded;
  }

  async findOne(id: string) {
    const result = await this.campaingRepository.findOne({
      where: {
        IdCampaing: id,
      },
    });
    return result;
  }

  async documentsByDeviceId(campaingId: string) {
    const campaingDocument = await this.campaingRepository.find({
      relations: ['CampaingDocument', 'CampaingDocument.Document'],
    });
    console.log(campaingDocument);
  }

  async update(id: string, updateCampaingDto: UpdateCampaingDto) {
    await this.campaingRepository.update(id, {
      CampaingName: updateCampaingDto.campaingName,
    });
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  async remove(id: string) {
    await this.campaingDocumentRepository.update(id, {
      Status: false,
      DateCancel: moment().utc().format(),
    });
    return {
      message: 'Operación realizada correctamente.',
    };
  }
}
