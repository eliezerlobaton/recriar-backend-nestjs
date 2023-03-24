import { MigrationInterface, QueryRunner } from 'typeorm';

export class limesurveyResponse1647434754115 implements MigrationInterface {
  name = 'limesurveyResponse1647434754115';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "limesurvey_response" ("tenantid" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "creationdate" TIMESTAMP NOT NULL DEFAULT now(), "lastmodificationdate" TIMESTAMP DEFAULT now(), "deletiondate" TIMESTAMP, "creationuserid" uuid, "lastmodificationuserid" uuid, "deletionuserid" uuid, "limesurvey_responseid" uuid NOT NULL DEFAULT uuid_generate_v4(), "surveyid" integer NOT NULL, "responses" jsonb array NOT NULL, "questions" jsonb array NOT NULL, "responseid" integer NOT NULL, "submitdate" TIMESTAMP NOT NULL, "lastpage" integer NOT NULL, "startlanguage" character varying NOT NULL, "seed" character varying NOT NULL, "customerid" uuid, CONSTRAINT "PK_5aa40245b2831e4f4157ce3a1e6" PRIMARY KEY ("limesurvey_responseid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" ADD CONSTRAINT "FK_5a466ff279cf622434f56575d05" FOREIGN KEY ("customerid") REFERENCES "customer"("customerid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "limesurvey_response" DROP CONSTRAINT "FK_5a466ff279cf622434f56575d05"`,
    );
    await queryRunner.query(`DROP TABLE "limesurvey_response"`);
  }
}
