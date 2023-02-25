import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { FileArticle } from './dto/file-article.dto';
import { errorsCatalog } from '../../common/errors-catalog';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(image: FileArticle, data: CreateArticleDto, user: any) {
    if (!image) {
      throw new BadRequestException(
        'Bad Request',
        'Se necesitan enviar archivo de imagen',
      );
    }

    const imageName = parseInt(
      `${Math.floor(100000 + Math.random() * 900000)}` +
        `${Math.floor(100000 + Math.random() * 900000)}`,
    );
    const durationArray = data.duration.split(':');
    const hours = durationArray[0];
    const minutes = durationArray[1];
    const seconds = durationArray[2];

    const article = this.articleRepository.create({
      IdArticle: uuid(),
      Created: moment().utc().format(),
      Modified: moment().utc().format(),
      Title: data.title,
      Author: data.author,
      Thumbnail: `${imageName}.jpg`,
      ArticleUrl: `${imageName}.html`, // aqui va el html que se debe generar y guardar
      Origin: 'General',
      EvaluationArticle: false,
      Status: true,
      UserId: user.id,
      DateCancel: null,
      Duration: `${hours}:${minutes}:${seconds}`,
      Category: data.category,
    });
    await this.articleRepository.save(article);
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  async findAll() {
    const result = await this.articleRepository.find({
      where: {
        Status: true,
      },
    });
    return result;
  }

  findOne(id: string) {
    return `This action returns a #${id} article`;
  }

  async update(id: string, image: FileArticle, data: UpdateArticleDto, user: any) {
    const fileName = moment().utc().format('yyMMDDHHmmss');
    const imageName = parseInt(
      `${Math.floor(100000 + Math.random() * 900000)}` +
        `${Math.floor(100000 + Math.random() * 900000)}`,
    );
    const durationArray = data.duration.split(':');
    const hours = durationArray[0];
    const minutes = durationArray[1];
    const seconds = durationArray[2];
    await this.articleRepository.update(id, {
      Modified: moment().utc().format(),
      EvaluationArticle: data.evaluationArticle,
      Title: data.title,
      Author: data.author,
      Thumbnail: `${imageName}.jpg`,
      ArticleUrl: `${imageName}.html`, // aqui va el html que se debe generar y guardar
      Origin: 'General',
      Status: true,
      UserId: user.id,
      DateCancel: null,
      Duration: `${hours}:${minutes}:${seconds}`,
      Category: data.category,
    });
    if (!image) {
      throw new BadRequestException(errorsCatalog.fileCantBeEmpty);
    }
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  async remove(id: string) {
    await this.articleRepository.update(id, {
      Status: false,
      DateCancel: moment().utc().format(),
    });
  }
}
