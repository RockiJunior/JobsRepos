import { PartialType } from '@nestjs/swagger';
import { CreateEventProviderDto } from './create-event-provider.dto';

export class UpdateEventProviderDto extends PartialType(CreateEventProviderDto) {}
