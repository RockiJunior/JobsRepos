import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Podcast } from './entities/podcast.entity';
import { Document } from '../Documents/entities/document.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { User } from '../Users/entities/user.entity';

@Injectable()
export class PodcastService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreatePodcastDto, files: CreatePodcastDto, user?: any) {
    if (!files.image && !files.audio) {
      throw new BadRequestException(
        'Bad Request',
        'Se necesitan enviar ambos archivos',
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

    const podcast = this.podcastRepository.create({
      IdPodcast: uuid(),
      Created: moment().utc().format(),
      Modified: moment().utc().format(),
      Title: data.title,
      Description: data.description,
      Thumbnail: `${imageName}.jpg`,
      PodcastUrl: `${imageName}.mp3`,
      Origin: 'General',
      EvaluationPodcast: data.evaluationPodcast,
      Status: true,
      UserId: user.id,
      DateCancel: null,
      Duration: `${hours}:${minutes}:${seconds}`,
    });
    await this.podcastRepository.save(podcast);
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  findAll() {
    return `This action returns all podcast`;
  }

  async findOne(id: string) {
    // Servicio para traer por id
    const podcastFinded = await this.podcastRepository.findOne({
      where: {
        IdPodcast: id,
      },
    });
    return podcastFinded;
  }

  async findByStatus() {
    const result = await this.podcastRepository.find({
      where: {
        Status: true,
      },
    });
    return result;
  }

  async update(files: UpdatePodcastDto, data: UpdatePodcastDto, id: string) {
    if (!files.image && !files.audio) {
      throw new BadRequestException(
        'Bad Request',
        'Se necesitan enviar ambos archivos',
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

    await this.podcastRepository.update(id, {
      Modified: moment().utc().format(),
      Title: data.title,
      Description: data.description,
      Thumbnail: `${imageName}.jpg`,
      PodcastUrl: `${imageName}.mp3`,
      Origin: 'General',
      EvaluationPodcast: data.evaluationPodcast,
      Status: true,
      DateCancel: null,
      Duration: `${hours}:${minutes}:${seconds}`,
    });

    return {
      message: 'Operación realizada correctamente.',
    };
  }

  remove(id: string) {
    return `This action removes a #${id} podcast`;
  }
}
