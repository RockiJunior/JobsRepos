import { Injectable } from '@nestjs/common';
import { CreateCompletedUserPodcastDto } from './dto/create-completed-user-podcast.dto';
import { UpdateCompletedUserPodcastDto } from './dto/update-completed-user-podcast.dto';

@Injectable()
export class CompletedUserPodcastService {
  create(createCompletedUserPodcastDto: CreateCompletedUserPodcastDto) {
    return 'This action adds a new completedUserPodcast';
  }

  findAll() {
    return `This action returns all completedUserPodcast`;
  }

  findOne(id: string) {
    return `This action returns a #${id} completedUserPodcast`;
  }

  update(
    id: string,
    updateCompletedUserPodcastDto: UpdateCompletedUserPodcastDto,
  ) {
    return `This action updates a #${id} completedUserPodcast`;
  }

  remove(id: string) {
    return `This action removes a #${id} completedUserPodcast`;
  }
}
