import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPartnersFields1642649766627 implements MigrationInterface {
  name = 'addPartnersFields1642649766627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partners" ADD "colony" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "municipality" character varying(255)`);
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
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "municipality"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "colony"`);
  }
}
