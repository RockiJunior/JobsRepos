import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPartnersFields1641667172532 implements MigrationInterface {
  name = 'addPartnersFields1641667172532';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partners" ADD "birthDate" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "nationality" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "age" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "civilStatus" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "partners" ADD "mobileNumber" character varying(255)`);
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
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "mobileNumber"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "civilStatus"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "age"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "nationality"`);
    await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "birthDate"`);
  }
}
