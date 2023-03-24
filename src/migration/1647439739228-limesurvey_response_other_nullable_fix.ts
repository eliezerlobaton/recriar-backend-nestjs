import { MigrationInterface, QueryRunner } from 'typeorm';

export class limesurveyResponseOtherNullableFix1647439739228
  implements MigrationInterface
{
  name = 'limesurveyResponseOtherNullableFix1647439739228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ALTER COLUMN "submitdate" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ALTER COLUMN "lastpage" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ALTER COLUMN "startlanguage" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ALTER COLUMN "seed" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ALTER COLUMN "seed" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ALTER COLUMN "startlanguage" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ALTER COLUMN "lastpage" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ALTER COLUMN "submitdate" SET NOT NULL`,
    );
  }
}
