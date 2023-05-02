import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Connection } from 'mongoose';
import { EntityManager } from 'typeorm';

@Injectable()
export class DatabaseService {
	constructor(
		@InjectEntityManager() private entityManager: EntityManager,
		@InjectConnection() private readonly mongooseConnection: Connection
	) {}

	async clearDB() {
		try {
			// -------------------------------------------------------- TYPEORM
			const entities = this.entityManager.connection.entityMetadatas;
			const query = entities
				.map((entity) => `TRUNCATE TABLE "${entity.tableName}" CASCADE;`)
				.join('\n');
			await this.entityManager.query(query);
			// --------------------------------------------------------- MONGO
			const collections = this.mongooseConnection.collections;
			for (const key in collections) {
				if (collections.hasOwnProperty(key)) {
					await collections[key].deleteMany({});
				}
			}
		} catch (err) {
			throw new NotImplementedException(err.message);
		}
	}
}
