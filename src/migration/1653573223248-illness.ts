import { MigrationInterface, QueryRunner } from 'typeorm';

export class illness1653573223248 implements MigrationInterface {
  name = 'illness1653573223248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "illness" ("tenantid" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "creationdate" TIMESTAMP NOT NULL DEFAULT now(), "lastmodificationdate" TIMESTAMP DEFAULT now(), "deletiondate" TIMESTAMP, "creationuserid" uuid, "lastmodificationuserid" uuid, "deletionuserid" uuid, "illnessid" uuid NOT NULL DEFAULT uuid_generate_v4(), "integrationid" character varying(100) NOT NULL, "description" character varying(150) NOT NULL, CONSTRAINT "PK_b7e099ee56fce032bfcfeed32fa" PRIMARY KEY ("illnessid"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "illness"`);
  }
}
