import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPartnersAddressFields1640666785682 implements MigrationInterface {
  name = 'addPartnersAddressFields1640666785682';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "zipcode" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "street" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "number" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "city" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "state" character varying(255)`);
    await queryRunner.query(`COMMENT ON COLUMN "loaded_partners"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "loaded_partners"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "loads"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "loads"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partner_files"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partner_files"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partners"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partners"."updateAt" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "partners"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partners"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partner_files"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partner_files"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "loads"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "loads"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "loaded_partners"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "loaded_partners"."createAt" IS NULL`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "state"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "number"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "street"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "zipcode"`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "address" character varying(255)`);
  }
}
