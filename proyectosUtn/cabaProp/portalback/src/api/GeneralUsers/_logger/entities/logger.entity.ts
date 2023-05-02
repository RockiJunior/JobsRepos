import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';
import { TypeOfUser, UserEnumStatus } from 'src/config/enum-types';

@Entity(EntityNamesGeneralUsers.logger)
export class LoggerEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	userId?: string;

	@Column({ type: 'varchar', length: 50, nullable: true })
	ipAddress: any;

	@Column({ type: 'jsonb', nullable: true })
	location: Object;

	@Column({ type: 'varchar', length: 80, nullable: true })
	firstName: string;

	@Column({ type: 'varchar', length: 80, nullable: true })
	lastName: string;

	@Column({ type: 'varchar', length: 80, nullable: true })
	email: string;

	@Column({ type: 'varchar', length: 40, nullable: true })
	dni: string;

	@Column({ type: 'varchar', length: 100, nullable: true })
	realAddress: string;

	@Column({ type: 'varchar', length: 100, nullable: true })
	legalAddress: string;

	@Column({ type: 'enum', enum: TypeOfUser, nullable: true })
	typeOfUser: TypeOfUser;

	@Column({ type: 'varchar', length: 255, nullable: true })
	adminUserId: string;

	@Column({
		type: 'enum',
		enum: UserEnumStatus,
		// default: UserEnumStatus.pending,
		nullable: true,
	})
	status: UserEnumStatus;

	@Column({ type: 'jsonb', nullable: true })
	registration: Object;

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

	@Column({ type: 'jsonb', nullable: true })
	body: Object;

	// -------------------------------- created_at
	@Column({ type: 'timestamp', nullable: true })
	created_at: Date;
	@BeforeInsert()
	async createDateAt() {
		this.created_at = new Date();
	}
}
