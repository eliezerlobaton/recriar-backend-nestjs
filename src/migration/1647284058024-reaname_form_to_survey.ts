import { MigrationInterface, QueryRunner } from 'typeorm';

export class reanameFormToSurvey1647284058024 implements MigrationInterface {
  name = 'reanameFormToSurvey1647284058024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "form" RENAME TO "survey"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" RENAME TO "form"`);
  }
}
