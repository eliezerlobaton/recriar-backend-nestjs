import { MigrationInterface, QueryRunner } from 'typeorm';

export class reminder1655475791441 implements MigrationInterface {
  name = 'reminder1655475791441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reminder" ("tenantid" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "creationdate" TIMESTAMP NOT NULL DEFAULT now(), "lastmodificationdate" TIMESTAMP DEFAULT now(), "deletiondate" TIMESTAMP, "creationuserid" uuid, "lastmodificationuserid" uuid, "deletionuserid" uuid, "reminderid" uuid NOT NULL DEFAULT uuid_generate_v4(), "reminder" text, CONSTRAINT "PK_e297f3f9c7424af91aa4981ba4c" PRIMARY KEY ("reminderid"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reminder"`);
  }
}
