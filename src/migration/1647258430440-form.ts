import { MigrationInterface, QueryRunner } from 'typeorm';

export class form1647258430440 implements MigrationInterface {
  name = 'form1647258430440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "form" ("tenantid" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "creationdate" TIMESTAMP NOT NULL DEFAULT now(), "lastmodificationdate" TIMESTAMP DEFAULT now(), "deletiondate" TIMESTAMP, "creationuserid" uuid, "lastmodificationuserid" uuid, "deletionuserid" uuid, "formid" uuid NOT NULL DEFAULT uuid_generate_v4(), "integrationid" character varying NOT NULL, "properties" jsonb NOT NULL, CONSTRAINT "UQ_85212886732523fc3639c03d452" UNIQUE ("integrationid"), CONSTRAINT "PK_235580d82bcba93a42fef295012" PRIMARY KEY ("formid"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "form"`);
  }
}
