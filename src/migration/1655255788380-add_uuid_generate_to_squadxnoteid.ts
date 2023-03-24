import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUuidGenerateToSquadxnoteid1655255788380
  implements MigrationInterface
{
  name = 'addUuidGenerateToSquadxnoteid1655255788380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "squadxnote" ALTER COLUMN "squadxnoteid" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "squadxnote" ALTER COLUMN "tenantid" SET DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "squadxnote" ALTER COLUMN "tenantid" DROP DEFAULT`,
    );

    await queryRunner.query(
      `ALTER TABLE "squadxnote" ALTER COLUMN "squadxnoteid" DROP DEFAULT`,
    );
  }
}
