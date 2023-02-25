import { TABLE_USER } from 'src/common/constants';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  // ManyToOne,
  // OneToMany,
  // OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from './role.entity';

@Entity({ name: TABLE_USER })
export class User {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column({ type: 'nvarchar', nullable: false })
  Name: string;

  @Column({ type: 'nvarchar' })
  FirstLastName: string;

  @Column({ type: 'nvarchar' })
  SecondLastName: string;

  @Column({ type: 'nvarchar' })
  Photo: string;

  @Column({ type: 'nvarchar' })
  Email: string;

  @Column({ type: 'bit', default: false, nullable: false })
  EmailConfirmed: boolean;

  @Column({ type: 'nvarchar' })
  @Exclude()
  PasswordHash: string;

  // @Column({ type: 'date' })
  // @Exclude()
  // ExpirationPassword: Date;

  // @Column({ type: 'nvarchar' })
  // SecurityStamp: string;

  @Column({ type: 'nvarchar' })
  PhoneNumber: string; // => no es obligatorio

  @Column({ type: 'bit', default: false, nullable: false })
  PhoneNumberConfirmed: boolean;

  @Column({ type: 'bit', default: false, nullable: false })
  TwoFactorEnabled: boolean;

  // @Column({ type: 'datetime' })
  // LockoutEndDateUtc: Date;

  @Column({ type: 'bit', default: false, nullable: false })
  LockoutEnabled: boolean;

  @Column({ type: 'int', default: false, nullable: false })
  AccessFailedCount: number;

  @Column({ type: 'nvarchar', nullable: true })
  UserName: string;

  @Column({ type: 'bit', default: true, nullable: false })
  Active: boolean;

  @Column({ type: 'datetime', nullable: false })
  LastPasswordChangedDate: Date;
  @BeforeInsert()
  async created() {
    this.LastPasswordChangedDate = new Date();
  }

  @Column({ type: 'datetime', nullable: true })
  DateCancel: Date;

  //Relations
  @ManyToMany(() => Role, (role) => role.User, {
    cascade: true,
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'ApplicationUserRole',
    joinColumn: {
      name: 'UserId', //'ApplicationUser_Id',
      referencedColumnName: 'Id',
    },
    inverseJoinColumn: {
      name: 'RoleId', // 'ApplicationRole_Id',
      referencedColumnName: 'Id',
    },
  })
  Role: Role[];
}
