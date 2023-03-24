import { MigrationInterface, QueryRunner } from 'typeorm';

export class contentSubmissionKnowledgeSubmission1645821610788
  implements MigrationInterface
{
  name = 'contentSubmissionKnowledgeSubmission1645821610788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "is_favorite" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ALTER COLUMN "squad_userid" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ALTER COLUMN "status" SET DEFAULT 'Pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "answer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "answer" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "answer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "answer" int4range`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ALTER COLUMN "squad_userid" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "is_favorite"`,
    );
  }
}
