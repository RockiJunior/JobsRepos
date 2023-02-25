import { PartialType } from '@nestjs/swagger';
import { CreateCompletedUserPodcastDto } from './create-completed-user-podcast.dto';

export class UpdateCompletedUserPodcastDto extends PartialType(CreateCompletedUserPodcastDto) {}
