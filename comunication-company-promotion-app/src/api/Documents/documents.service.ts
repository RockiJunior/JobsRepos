import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { FileDocument } from './dto/file-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CampaingDocument } from '../Devices/entities/campaingDocument.entity';
import { errorsCatalog } from 'src/common/errors-catalog';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(CampaingDocument)
    private campaingDocument: Repository<CampaingDocument>,
  ) {}

  async create(file: FileDocument, data: CreateDocumentDto, user: any) {
    const fileName = moment().utc().format('yyMMDDHHmmss');
    const document = this.documentRepository.create({
      IdDocument: uuid(),
      Name: data.name,
      PdfName: data.name,
      DocumentUrl: 'DOC-' + fileName + '.pdf', // TODO: Confirmar nomenclatura 12 dígitos
      Created: new Date(),
      Modified: new Date(),
      Evaluation: data.evaluation == true,
      Type: data.type,
      Status: true,
      UserId: user.id,
    });
    await this.documentRepository.save(document);
    if (!file) {
      throw new BadRequestException(
        errorsCatalog.fileCantBeEmpty,
        'FILE_CANT_BE_EMPTY',
      );
    }
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  async update(id: string, file: FileDocument, data: UpdateDocumentDto) {
    const fileName = moment().utc().format('yyMMDDHHmmss');
    await this.documentRepository.update(id, {
      Modified: moment().utc().format(),
      DocumentUrl: 'DOC-' + fileName + '.pdf',
      Evaluation: data.evaluation,
    });
    if (!file) {
      throw new BadRequestException(
        errorsCatalog.fileCantBeEmpty,
        'FILE_CANT_BE_EMPTY',
      );
    }
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  async findByType(type: number) {
    // esto solo valida las primeras 4 categorias
    let result = {};
    result = await this.documentRepository.find({
      where: {
        Type: type,
        Status: true,
      },
    });
    const response: Document[] = <Document[]>result;
    response.forEach((document) => {
      document.DocumentUrl =
        'https://telcel-portal.azurewebsites.net/Repository/pdf?file=' +
        document.DocumentUrl;
    });
    return result;
  }

  async documentsByDeviceId(campaingId: string) {
    const campaingDocument = await this.campaingDocument.find({
      relations: ['Document'],
      where: {
        CampaingId: campaingId,
      },
    });
    return campaingDocument;
  }

  async removeDocument(id: string) {
    const date = moment().utc().format();
    await this.documentRepository.update(id, {
      Status: false,
      DateCancel: date,
    });
    return {
      message: 'Operación realizada correctamente.',
    };
  }
}
