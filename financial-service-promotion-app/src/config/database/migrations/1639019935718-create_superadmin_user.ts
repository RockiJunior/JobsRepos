import { MigrationInterface, QueryRunner } from 'typeorm';

export class createSuperadminUser1639019935718 implements MigrationInterface {
  name = 'createSuperadminUser1639019935718';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "users"(
            name, email, password, role)
            VALUES (
                'Jorge Fernandez', 
                'jorge.fernandez@gigigo.com', 
                '$2b$10$lJp5K/K7cn.Uivr8urPaO.Iavo.MxMQKQMECnWvzYgYVOKzZlo5N2',
                'superadmin'
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" where email = "jorge.fernandez@gigigo.com"`);
  }
}
