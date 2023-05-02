import { EntityNamesGeneralUsers } from 'src/config/entityNames/entityNames';
import { TypeOfUser } from 'src/config/enum-types';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity(`${EntityNamesGeneralUsers.invitations}`)
export class Invitations {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 50, nullable: true })
	firstName: string;

	@Column({ type: 'varchar', length: 80, nullable: true })
	lastName: string;

	@Column({ type: 'varchar', length: 100, nullable: true })
	email: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	token: string;

	@Column({
		type: 'enum',
		enum: [TypeOfUser.adminUser, TypeOfUser.collabUser, TypeOfUser.clientUser],
		nullable: true,
	})
	typeOfUser: TypeOfUser;

	@Column({ type: 'bool', nullable: true, default: 0 })
	isVerified: boolean;

	@Column({ type: 'timestamp', nullable: true })
	created_at: Date;
	@BeforeInsert()
	async createDateAt() {
		this.created_at = new Date();
	}

	@Column({ type: 'timestamp', nullable: true })
	expired_at: Date;
	@BeforeInsert()
	async expireDateAt() {
		this.expired_at = new Date(Date.now() + 3600 * 1000 * 24);
	}
}
