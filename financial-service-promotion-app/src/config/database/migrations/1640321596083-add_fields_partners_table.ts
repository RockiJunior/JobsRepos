import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFieldsPartnersTable1640321596083 implements MigrationInterface {
  name = 'addFieldsPartnersTable1640321596083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "accountName"`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "lastName" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "motherLastName" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "affiliationContract" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "privacyNotice" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "confidentialityNotice" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "confidentialityNotice"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "privacyNotice"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "affiliationContract"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "motherLastName"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "accountName" character varying(255)`);
  }
}
