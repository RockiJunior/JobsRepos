import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async create(data: CreateVideoDto, files: CreateVideoDto, user: any) {
    if (!files.image && !files.video) {
      throw new BadRequestException(
        'Bad Request',
        'Se necesitan enviar ambos archivos',
      );
    }
    const videoName = parseInt(
      `${Math.floor(100000 + Math.random() * 900000)}` +
        `${Math.floor(100000 + Math.random() * 900000)}`,
    );
    const durationArray = data.duration.split(':');
    const hours = durationArray[0];
    const minutes = durationArray[1];
    const seconds = durationArray[2];

    const videoCreated = await this.videoRepository.create({
      IdVideo: uuid(),
      Created: moment().utc().format(),
      Modified: moment().utc().format(),
      Title: data.title,
      Description: data.description,
      Thumbnail: `${videoName}.jpg`,
      VideoUrl: `${videoName}.mp4`,
      Origin: 'General',
      EvaluationVideo: false,
      Status: true,
      UserId: user.id,
      DateCancel: null,
      Duration: `${hours}:${minutes}:${seconds}`,
    });
    await this.videoRepository.save(videoCreated);
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  findAll() {
    return `This action returns all video`;
  }

  findOne(id: string) {
    return `This action returns a #${id} video`;
  }

  async update(files: UpdateVideoDto, data: UpdateVideoDto, id: string) {
    if (!files.image && !files.video) {
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

    await this.videoRepository.update(id, {
      Modified: moment().utc().format(),
      Title: data.title,
      Description: data.description,
      Thumbnail: `${imageName}.jpg`,
      VideoUrl: `${imageName}.mp3`,
      Origin: 'General',
      EvaluationVideo: data.evaluationVideo,
      Status: true,
      DateCancel: null,
      Duration: `${hours}:${minutes}:${seconds}`,
    });

    return {
      message: 'Operación realizada correctamente.',
    };
  }

  async remove(id: string) {
    const date = moment().utc().format();
    await this.videoRepository.update(id, {
      Status: false,
      DateCancel: date,
    });
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  async findByStatus() {
    const result = await this.videoRepository.find({
      where: {
        Status: true,
      },
    });
    return result;
  }
}
