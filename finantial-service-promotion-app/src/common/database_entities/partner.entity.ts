import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AsociadoStatus, EnumcontractsTypes, PARTNERS } from '../constants';
import { Exclude } from 'class-transformer';
import { PartnerFile } from './partnerFile.entity';
import { CourseToPartner } from './coursePartner.entity';
import { BankAccountEntity } from './bankAccount.entity';
import { Sessions } from './sessions.entity';
import { Movements } from './movements.entity';
import { Reports } from './reports.entity';
import { ReferredEntity } from './referred.entity';
import { RankingPartnersLead } from './rankingPartnersLead.entity';
import { RankingPartnersIndiv } from './rankingPartnersIndiv.entity';
import { IndividualCommissions } from './individual_commissions.entity';
import { MonthlyBonus } from './monthly_bonus.entity';
import { LeadershipCommissions } from './leadership_commissions.entity';
import { MonthlyGoal } from './monthly_goal.entity';
import { Territory } from './territories.entity';
import { PartnerChanged } from './partner_changed.entity';
import { Ranking } from './ranking_partners.entity';

@Entity({ name: PARTNERS })
export class Partner {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Exclude()
  @Column({ type: 'int' })
  validityPassword: number;

  @Exclude()
  @Column('simple-array')
  lasts_passwords: string[];

  @Column({ type: 'int' })
  verified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  motherLastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  birthDate: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nationality: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  birthPlace: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  age: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  rfc: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  curp: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  civilStatus: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gender: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mobileNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  street: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  internalNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  colony: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  municipality: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  zipcode: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  preAffiliationId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  folio: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  alphanumeric: string;

  @Column({ type: 'date', nullable: true })
  dischargeDate: Date;

  @Column({ type: 'varchar', nullable: true })
  rejectedReason: string;

  @Column({ type: 'date', nullable: true })
  rejectedDate: Date;

  @Column({ type: 'int', nullable: true })
  week: number;

  @Column({ type: 'date', nullable: true })
  disableDate: Date;

  @Column({ type: 'varchar', nullable: true })
  disableReason: string;

  @Column({ type: 'varchar', nullable: true })
  disabledWrittenReason: string;

  @Column({ type: 'date', nullable: true })
  removalDate: Date;

  @Column({ type: 'int', default: false })
  mailsSent: boolean;

  @OneToMany(() => PartnerFile, partnerFile => partnerFile.partner, {
    cascade: true,
  })
  files: PartnerFile[];

  @OneToMany(() => CourseToPartner, courseToPartner => courseToPartner.partner, {
    cascade: true,
  })
  courseToPartner: CourseToPartner[];

  @OneToOne(() => BankAccountEntity, {
    cascade: true,
  })
  @JoinColumn()
  bankAccount: BankAccountEntity;

  @OneToMany(() => Reports, reports => reports.partner, {
    cascade: true,
  })
  reports: Reports[];

  @OneToMany(() => ReferredEntity, refered => refered.id)
  referred: ReferredEntity[];

  @OneToOne(() => Sessions, sessions => sessions.partner)
  sessions: Sessions;

  @OneToMany(() => Movements, movements => movements.partner)
  movements: Movements;

  @OneToMany(() => RankingPartnersLead, RankingPartnersLead => RankingPartnersLead.partner, {
    cascade: true,
  })
  leadership_ranking: RankingPartnersLead[];

  @OneToMany(() => RankingPartnersIndiv, rankingPartnerIndiv => rankingPartnerIndiv.partner)
  individual_ranking: RankingPartnersIndiv;

  @OneToMany(() => IndividualCommissions, individualCommissions => individualCommissions.partner)
  individual_commission: IndividualCommissions;

  @OneToMany(() => MonthlyBonus, monthlyBonus => monthlyBonus.partner)
  month_bonus: MonthlyBonus;

  @OneToMany(() => LeadershipCommissions, leadership => leadership)
  leadership_commission: LeadershipCommissions;

  @OneToMany(() => MonthlyGoal, monthlyGoal => monthlyGoal.partner)
  monthly_goal: MonthlyGoal;

  @ManyToOne(() => Territory, territory => territory.partners)
  territory: Territory;

  @OneToMany(() => PartnerChanged, partnerChanged => partnerChanged.partner)
  partnerChanged: PartnerChanged;

  @OneToMany(() => Ranking, ranking => ranking.partner)
  ranking: Ranking;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  createDateAt() {
    this.createdAt = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async updateDateAt() {
    this.updatedAt = new Date();
  }

  contracts: {
    affiliationContract?: string;
    privacyNotice?: string;
    confidentialityNotice?: string;
  };

  @AfterLoad()
  generateContractsUrls(): void {
    this.contracts = Object.keys(EnumcontractsTypes).reduce((contracts, type) => {
      if (this[type]) {
        contracts[type] = `${process.env.FILES_PATH}/${EnumcontractsTypes[type]}_${this.id}.pdf`;
      }
      return contracts;
    }, {});
  }
}
