import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFieldsPartnersTable1640156003186 implements MigrationInterface {
  name = 'addFieldsPartnersTable1640156003186';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "verification_token"`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "verificationToken" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "name" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "rfc" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "curp" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "address" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "accountName" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "bank" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "accountNumber" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "clabe" character varying(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "clabe"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "accountNumber"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "bank"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "accountName"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "curp"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "rfc"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "verificationToken"`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "verification_token" character varying(255)`);
  }
}
