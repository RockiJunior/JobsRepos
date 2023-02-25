import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';

@Entity(EntityNamesGeneralUsers.logger)
export class LoggerEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	userId?: string;

	@Column({ type: 'varchar', nullable: true })
	method: string;

	@Column({ type: 'numeric', nullable: true })
	statusCode: number;

	@Column({ type: 'varchar', length: 800, nullable: true })
	url?: string;

	@Column({ type: 'simple-json', nullable: true })
	headers?: any;

	@Column({ type: 'varchar', nullable: true })
	error?: string;

	// -------------------------------- created_at
	@Column({ type: 'timestamp', nullable: true })
	created_at: Date;
	@BeforeInsert()
	async createDateAt() {
		this.created_at = new Date();
	}
}
