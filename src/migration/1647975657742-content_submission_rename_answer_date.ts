import { MigrationInterface, QueryRunner } from 'typeorm';

export class contentSubmissionRenameAnswerDate1647975657742
  implements MigrationInterface
{
  name = 'contentSubmissionRenameAnswerDate1647975657742';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" RENAME COLUMN "answer_date" TO "rating_date"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" RENAME COLUMN "rating_date" TO "answer_date"`,
    );
  }
}
