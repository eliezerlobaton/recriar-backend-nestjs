import { MigrationInterface, QueryRunner } from 'typeorm';

export class assistantRequestEndDate1649360700765
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assistant_request" ALTER COLUMN "end_date" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assistant_request" ALTER COLUMN "end_date" SET NOT NULL`,
    );
  }
}
