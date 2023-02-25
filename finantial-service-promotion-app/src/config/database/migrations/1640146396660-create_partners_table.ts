import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPartnersTable1640146396660 implements MigrationInterface {
  name = 'createPartnersTable1640146396660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "partners" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "verified" boolean NOT NULL, "verification_token" character varying(255), "createAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updateAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_998645b20820e4ab99aeae03b41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6b39bc13ab676e74eada2e744d" ON "partners" ("email") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_6b39bc13ab676e74eada2e744d"`);
    await queryRunner.query(`DROP TABLE "partners"`);
  }
}
