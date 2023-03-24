import { MigrationInterface, QueryRunner } from 'typeorm';

export class contentSubmissionRemoveAnswerColumn1647947352601
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "rating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" RENAME COLUMN "answer" TO "rating"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" RENAME COLUMN "rating" TO "answer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "rating" integer`,
    );
  }
}
