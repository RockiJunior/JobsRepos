import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCoursesTable1643740116712 implements MigrationInterface {
  name = 'createCoursesTable1643740116712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "course_to_partner" ("id" SERIAL NOT NULL, "courseId" integer NOT NULL, "partnerId" integer NOT NULL, "status" character varying NOT NULL, "note" character varying NOT NULL, "evaluationDate" character varying NOT NULL, CONSTRAINT "PK_f02f96facf50282c4a7c7566f46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "url" character varying(255) NOT NULL, "createDate" character varying(255) NOT NULL, "validityDate" character varying(255) NOT NULL, "status" character varying(255) NOT NULL, "type" character varying(255) NOT NULL, "initial" boolean NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updateAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6ba1a54849ae17832337a39d5e" ON "courses" ("name") `);
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
    await queryRunner.query(
      `ALTER TABLE "course_to_partner" ADD CONSTRAINT "FK_c1c0876547deb44862144306ac3" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course_to_partner" DROP CONSTRAINT "FK_c1c0876547deb44862144306ac3"`);
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
    await queryRunner.query(`DROP INDEX "IDX_6ba1a54849ae17832337a39d5e"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TABLE "course_to_partner"`);
  }
}
