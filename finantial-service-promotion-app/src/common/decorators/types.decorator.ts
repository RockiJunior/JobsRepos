import { SetMetadata } from '@nestjs/common';

export const Types = (...roles: string[]) => SetMetadata('types', roles);
