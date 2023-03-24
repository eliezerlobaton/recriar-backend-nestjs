import { MigrationInterface, QueryRunner } from 'typeorm';

export class contentSubmissionStatusFix1645561803768
  implements MigrationInterface
{
  name = 'contentSubmissionStatusFix1645561803768';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP CONSTRAINT "FK_6f9b95365824cd9cad17ee7e089"`,
    );
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
      `ALTER TABLE "content_submission" DROP COLUMN "knowledgeid"`,
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
      `ALTER TABLE "content_submission" ADD "knowledgeid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "status" SET DEFAULT 'NotInteracted'`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD CONSTRAINT "FK_6f9b95365824cd9cad17ee7e089" FOREIGN KEY ("knowledgeid") REFERENCES "knowledge"("knowledgeid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP CONSTRAINT "FK_6f9b95365824cd9cad17ee7e089"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "knowledgeid"`,
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
      `ALTER TABLE "content_submission" ADD "knowledgeid" uuid`,
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
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD CONSTRAINT "FK_6f9b95365824cd9cad17ee7e089" FOREIGN KEY ("knowledgeid") REFERENCES "knowledge"("knowledgeid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
