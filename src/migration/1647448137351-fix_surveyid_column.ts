import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixSurveyidColumn1647448137351 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey" RENAME COLUMN "formid" TO "surveyid"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey" RENAME COLUMN "surveyid" TO "formid"`,
    );
  }
}
