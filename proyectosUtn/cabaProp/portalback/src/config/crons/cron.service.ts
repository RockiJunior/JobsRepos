import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Model } from 'mongoose';
import { Conversation } from 'src/api/GeneralUsers/conversations/entities/conversation.entity';
import { Posts } from 'src/api/GeneralUsers/posts/entities/post.entity';
import {
	Statistics,
	StatisticsDocument,
} from 'src/api/Properties/statistics/schema/statistics.schema';
import { Between, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RequestLoggerMiddleware } from '../middlewares/request-logger.middleware';
import cron from 'node-cron';
import { ObjectId } from 'mongodb';

@Injectable()
export class CronService {
	private readonly loggerConsole = new Logger(RequestLoggerMiddleware.name);
	constructor(
		@InjectModel(Statistics.name)
		private statisticsSchema: Model<StatisticsDocument>,
		@InjectRepository(Posts)
		private readonly postsRepository: Repository<Posts>,
		@InjectRepository(Conversation)
		private readonly conversationRepository: Repository<Conversation>,
		@InjectConnection() private connection: Connection
	) {}

	async monthlyStatisticsCron() {
		try {
			const monthlyStatistics = await cron.schedule(
				// '*/5 * * * * *', // para hacer test del cron...esto ejecuta cada 5 segundos
				'0 3 1 * *',
				async () => {
					// ---------------------------------------------------------------------------------------------- Dates
					const now = new Date();
					const month = now.getMonth() + 1;
					const year = now.getFullYear();
					const lastMonth = new Date(
						now.getFullYear(),
						now.getMonth() - 1,
						now.getDate()
					);
					// ---------------------------------------------------------------------------------------------- collection & db
					const collectionName = `statistics-${year}-${month}`;
					const collections = await this.connection.db
						.listCollections()
						.toArray();
					const collectionExists = collections.some(
						(c) => c.name === collectionName
					);
					// ---------------------------------------------------------------------------------------------- Logic
					if (collectionExists) {
						this.loggerConsole.error(
							`La colección ${collectionName} ya existe`
						);
					} else {
						const db = this.connection.db; // traigo la conección
						await db.createCollection(collectionName); // creo la colección
						this.loggerConsole.log(
							`La colección ${collectionName} ha sido creada`
						);
						// busco las estadisticas
						const propertyViews = await this.statisticsSchema.aggregate([
							{
								$group: {
									_id: '$propertyId',
									totalEvents: { $sum: 1 },
									firstEventDate: { $min: '$created_at' }, // sirve para saber cuando fue el primer registro
									lastEventDate: { $max: '$created_at' }, // sirve para saber cuando fue el ultimo registro
									userIds: { $addToSet: '$userId' }, // trae lista de userIds sin repetir || NO BORRAR
									ipAddress: { $addToSet: '$ipAddress' }, // trae lista de ipAddress sin repetir || NO BORRAR
								},
							},
						]);

						let favorites = [];
						let queries = [];
						let views = [];
						for (const view of propertyViews) {
							const postsCount = await this.postsRepository.count({
								where: {
									propertyId: view._id.toString(),
									created_at: Between(lastMonth, now),
								},
							});
							const conversationCount = await this.conversationRepository.count(
								{
									where: {
										propertyId: view._id.toString(),
									},
								}
							);
							favorites.push({
								propertyId: view._id.toString(),
								postsCount,
							});
							queries.push({
								propertyId: view._id.toString(),
								conversationCount,
							});
							views.push({
								propertyId: view._id.toString(),
								viewsNumber: view.totalEvents,
							});
						}
						const properties = [];
						favorites.forEach((fav) => {
							const propertyId = fav.propertyId;
							const existingProperty = properties.find(
								(p) => p.propertyId === propertyId
							);
							if (!existingProperty) {
								properties.push({
									_id: new ObjectId(),
									propertyId: propertyId,
									queries: 0,
									interested: fav.postsCount,
									viewsNumber: 0,
								});
							} else {
								existingProperty.interested = fav.postsCount;
							}
						});
						queries.forEach((query) => {
							const propertyId = query.propertyId;
							const existingProperty = properties.find(
								(p) => p.propertyId === propertyId
							);
							if (!existingProperty) {
								properties.push({
									_id: new ObjectId(),
									propertyId: propertyId,
									queries: query.conversationCount,
									interested: 0,
									viewsNumber: 0,
								});
							} else {
								existingProperty.queries = query.conversationCount;
							}
						});
						views.forEach((view) => {
							const propertyId = view.propertyId;
							const existingProperty = properties.find(
								(p) => p.propertyId === propertyId
							);
							if (!existingProperty) {
								properties.push({
									_id: new ObjectId(),
									propertyId: propertyId,
									queries: 0,
									interested: 0,
									viewsNumber: view.viewsNumber,
								});
							} else {
								existingProperty.viewsNumber = view.viewsNumber;
							}
						});
						const monthlyConnection = db.collection(collectionName); // nombre de la colección para inyectar los datos
						if (properties.length > 0) {
							this.loggerConsole.log('Cron Triggered Successfully');
							await monthlyConnection.insertMany(properties);
						}
					}
				}
			);
			await monthlyStatistics.start();
		} catch (error) {
			this.loggerConsole.error(error);
		}
	}
}
