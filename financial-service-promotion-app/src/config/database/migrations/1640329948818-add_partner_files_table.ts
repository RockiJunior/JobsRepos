import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPartnerFilesTable1640329948818 implements MigrationInterface {
  name = 'addPartnerFilesTable1640329948818';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "partner_files" ("id" SERIAL NOT NULL, "type" character varying(255) NOT NULL, "path" character varying(255) NOT NULL, "status" character varying(255) NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updateAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "partnerId" integer, CONSTRAINT "PK_7e5570e5500cb5cb7bb9573fbf7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "partners"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partners"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."updateAt" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "partner_files" ADD CONSTRAINT "FK_036f3bfba108ab53b52969f677f" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_files" DROP CONSTRAINT "FK_036f3bfba108ab53b52969f677f"`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partners"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partners"."createAt" IS NULL`);
    await queryRunner.query(`DROP TABLE "partner_files"`);
  }
}
