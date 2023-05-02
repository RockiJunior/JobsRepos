import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { Statistics, StatisticsDocument } from './schema/statistics.schema';

@Injectable()
export class StatisticsService {
	constructor(
		@InjectModel(Statistics.name)
		private readonly statisticsSchema: Model<StatisticsDocument>
	) {}
	create(createStatisticDto: CreateStatisticDto) {
		return 'This action adds a new statistic';
	}

	async findAll() {
		const statistics = await this.statisticsSchema.find({});
		if (statistics.length === 0) {
			throw new NotFoundException('No se han encontrado estadisticas');
		}
		return {
			allStatisticsLength: statistics.length,
			result: statistics,
		}
	}

	findOne(id: number) {
		return `This action returns a #${id} statistic`;
	}

	update(id: number, updateStatisticDto: UpdateStatisticDto) {
		return `This action updates a #${id} statistic`;
	}

	remove(id: number) {
		return `This action removes a #${id} statistic`;
	}
}
