import { MigrationInterface, QueryRunner } from 'typeorm';

export class contentSubmissionStatus1645542605722
  implements MigrationInterface
{
  name = 'contentSubmissionStatus1645542605722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "answer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "answer_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "rating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "answer" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "answer_date" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "rating" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "status" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "status" SET DEFAULT 'NotInteracted'`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "status" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "rating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "answer_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "answer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "rating" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "answer_date" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "answer" integer`,
    );
  }
}
