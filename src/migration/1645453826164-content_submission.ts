import { MigrationInterface, QueryRunner } from 'typeorm';

export class contentSubmission1645453826164 implements MigrationInterface {
  name = 'contentSubmission1645453826164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "answer" int4range`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "answer_date" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "answer_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "answer"`,
    );
  }
}
