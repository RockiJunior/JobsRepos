import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLoadsTables1640340072409 implements MigrationInterface {
  name = 'addLoadsTables1640340072409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "loaded_partners" ("id" SERIAL NOT NULL, "partnerCode" character varying(7) NOT NULL, "leaderCode" character varying(7) NOT NULL, "coordinationCode" integer NOT NULL, "coordinationName" character varying(30) NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updateAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "loadId" integer, CONSTRAINT "PK_add00dd131b329df7abd3000dd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_82f1af7891fc26c635106738b0" ON "loaded_partners" ("partnerCode") `,
    );
    await queryRunner.query(
      `CREATE TABLE "loads" ("id" SERIAL NOT NULL, "type" character varying(50) NOT NULL, "acceptedRecords" integer NOT NULL, "rejectedRecords" integer NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updateAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" integer, CONSTRAINT "PK_c90caf6ef671c1a292bc4b4bc1b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "users"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partner_files"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partner_files"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partners"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partners"."updateAt" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "loaded_partners" ADD CONSTRAINT "FK_e204a27b75009eeccc079d0ac3a" FOREIGN KEY ("loadId") REFERENCES "loads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" ADD CONSTRAINT "FK_8557947ee0f2e889f48dbe9e0c4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loads" DROP CONSTRAINT "FK_8557947ee0f2e889f48dbe9e0c4"`);
    await queryRunner.query(`ALTER TABLE "loaded_partners" DROP CONSTRAINT "FK_e204a27b75009eeccc079d0ac3a"`);
    await queryRunner.query(`COMMENT ON COLUMN "partners"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partners"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partner_files"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "partner_files"."createAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "users"."createAt" IS NULL`);
    await queryRunner.query(`DROP TABLE "loads"`);
    await queryRunner.query(`DROP INDEX "IDX_82f1af7891fc26c635106738b0"`);
    await queryRunner.query(`DROP TABLE "loaded_partners"`);
  }
}
