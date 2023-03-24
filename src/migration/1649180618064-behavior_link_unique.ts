import { MigrationInterface, QueryRunner } from 'typeorm';

export class behaviorLinkUnique1649180618064 implements MigrationInterface {
  name = 'behaviorLinkUnique1649180618064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "behavior" ADD CONSTRAINT "UQ_eda78b150f7be606f1ad4e54414" UNIQUE ("link")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "behavior" DROP CONSTRAINT "UQ_eda78b150f7be606f1ad4e54414"`,
    );
  }
}
