import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UtilsController } from './utils.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationTypes } from './entities/operation-types.entity';
import { PropertyTypes } from './entities/property-types.entity';
import { AntiquityTypes } from './entities/antiquity-types.entity';
import { CurrencyTypes } from './entities/currency-types.entity';
import { GralCharacteristics } from './entities/gral-characteristics.entity';
import { AmbienceTypes } from './entities/ambience-types.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			AntiquityTypes,
			CurrencyTypes,
			GralCharacteristics,
			PropertyTypes,
			OperationTypes,
			AmbienceTypes,
		]),
	],
	controllers: [UtilsController],
	providers: [UtilsService],
})
export class UtilsModule {}
