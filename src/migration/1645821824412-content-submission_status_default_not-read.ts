import { MigrationInterface, QueryRunner } from 'typeorm';

export class contentSubmissionStatusDefaultNotRead1645821824412
  implements MigrationInterface
{
  name = 'contentSubmissionStatusDefaultNotRead1645821824412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "status" SET DEFAULT 'NotRead'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "status" SET DEFAULT 'NotInteracted'`,
    );
  }
}
