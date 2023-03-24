import { MigrationInterface, QueryRunner } from 'typeorm';

export class behavior1646769919419 implements MigrationInterface {
  name = 'behavior1646769919419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "behavior" ("tenantid" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "creationdate" TIMESTAMP NOT NULL DEFAULT now(), "lastmodificationdate" TIMESTAMP DEFAULT now(), "deletiondate" TIMESTAMP, "creationuserid" uuid, "lastmodificationuserid" uuid, "deletionuserid" uuid, "behaviorid" uuid NOT NULL DEFAULT uuid_generate_v4(), "integrationid" character varying(100), "behavior_type" character varying NOT NULL, "description" character varying(150) NOT NULL, "link" character varying, "activity_text" text, CONSTRAINT "PK_e4d1b1ec01d9da4f6f780821e7b" PRIMARY KEY ("behaviorid"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "behavior"`);
  }
}
