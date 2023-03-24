import { MigrationInterface, QueryRunner } from 'typeorm';

export class guidanceStatus1647457354800 implements MigrationInterface {
  name = 'guidanceStatus1647457354800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guidance" ADD "status" character varying(15) NOT NULL DEFAULT 'Pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "guidance" DROP COLUMN "status"`);
  }
}
