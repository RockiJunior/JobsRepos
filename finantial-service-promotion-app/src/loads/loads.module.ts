import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadsController } from './controllers/loads.controller';
import { Load } from './entities/load.entity';
import { LoadedPartner } from './entities/loadedPartner.entity';
import { LoadedCoursePartner } from './entities/loadedCoursePartner.entity';
import { LoadsService } from './services/loads.service';
import { Course } from '../common/database_entities/course.entity';
import { Partner } from '../common/database_entities/partner.entity';
import { MovementTypes } from '../common/database_entities/movement_types.entity';
import { Movements } from 'src/common/database_entities/movements.entity';
import { LoadMovement } from 'src/common/database_entities/loadMovement.entity';
import { LoadCourseToPartner } from 'src/common/database_entities/loadCourseToPartner.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Load,
      LoadedPartner,
      LoadedCoursePartner,
      Course,
      Partner,
      MovementTypes,
      Movements,
      LoadMovement,
      LoadCourseToPartner,
    ]),
  ],
  controllers: [LoadsController],
  providers: [LoadsService],
})
export class LoadsModule {}
