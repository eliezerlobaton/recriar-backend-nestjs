import { MigrationInterface, QueryRunner } from 'typeorm';

export class behaviorSelfConnect1653414286911 implements MigrationInterface {
  name = 'behaviorSelfConnect1653414286911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "behavior" ADD "automatic_send" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "behavior" ALTER COLUMN "behavior_type" SET DEFAULT 'Form'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "behavior" ALTER COLUMN "behavior_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "behavior" DROP COLUMN "automatic_send"`,
    );
  }
}
