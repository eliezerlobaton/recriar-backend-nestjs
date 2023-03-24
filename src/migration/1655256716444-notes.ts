import { MigrationInterface, QueryRunner } from 'typeorm';

export class notes1655256716444 implements MigrationInterface {
  name = 'notes1655256716444';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "squadxnote" ALTER COLUMN "creationdate" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "squadxnote" ALTER COLUMN "lastmodificationdate" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "squadxnote" ALTER COLUMN "creationdate" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "squadxnote" ALTER COLUMN "lastmodificationdate" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "squadxnote" ALTER COLUMN "creationdate" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "squadxnote" ALTER COLUMN "lastmodificationdate" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "squadxnote" ALTER COLUMN "creationdate" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "squadxnote" ALTER COLUMN "lastmodificationdate" DROP DEFAULT`,
    );
  }
}
