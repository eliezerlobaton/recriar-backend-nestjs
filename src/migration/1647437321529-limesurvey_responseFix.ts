import { MigrationInterface, QueryRunner } from 'typeorm';

export class limesurveyResponseFix1647437321529 implements MigrationInterface {
  name = 'limesurveyResponseFix1647437321529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" DROP COLUMN "responses"`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ADD "responses" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" DROP COLUMN "questions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ADD "questions" jsonb NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" DROP COLUMN "questions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ADD "questions" jsonb array NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" DROP COLUMN "responses"`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ADD "responses" jsonb array NOT NULL`,
    );
  }
}
