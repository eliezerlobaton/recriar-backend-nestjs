import { MigrationInterface, QueryRunner } from 'typeorm';

export class baseEntity1645197114019 implements MigrationInterface {
  name = 'baseEntity1645197114019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "knowledgexcustomer" ("knowledgeid" uuid NOT NULL, "customerid" uuid NOT NULL, CONSTRAINT "PK_3ebd987e454e70724e5dbc4738d" PRIMARY KEY ("knowledgeid", "customerid"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_02d990404652d63d0712ecd493" ON "knowledgexcustomer" ("knowledgeid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_52bac4e63e82935daccc9e7fe0" ON "knowledgexcustomer" ("customerid") `,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "isactive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "isarchived"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "createat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "updateat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "isactive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "isarchived"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "createat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "updateat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "tenantid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "creationdate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "lastmodificationdate" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "deletiondate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "creationuserid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "lastmodificationuserid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "deletionuserid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "tenantid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "creationdate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "lastmodificationdate" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "deletiondate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "creationuserid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "lastmodificationuserid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "deletionuserid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "send_date" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "reading_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ALTER COLUMN "answer" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ALTER COLUMN "answer_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ALTER COLUMN "send_date" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledgexcustomer" ADD CONSTRAINT "FK_02d990404652d63d0712ecd493d" FOREIGN KEY ("knowledgeid") REFERENCES "knowledge"("knowledgeid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledgexcustomer" ADD CONSTRAINT "FK_52bac4e63e82935daccc9e7fe09" FOREIGN KEY ("customerid") REFERENCES "customer"("customerid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledgexcustomer" DROP CONSTRAINT "FK_52bac4e63e82935daccc9e7fe09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledgexcustomer" DROP CONSTRAINT "FK_02d990404652d63d0712ecd493d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ALTER COLUMN "send_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ALTER COLUMN "answer_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ALTER COLUMN "answer" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "reading_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ALTER COLUMN "send_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "deletionuserid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "lastmodificationuserid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "creationuserid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "deletiondate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "lastmodificationdate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "creationdate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "tenantid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "deletionuserid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "lastmodificationuserid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "creationuserid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "deletiondate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "lastmodificationdate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "creationdate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "tenantid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "updateat" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "createat" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "isarchived" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "isactive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "updateat" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "createat" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "isarchived" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "isactive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_52bac4e63e82935daccc9e7fe0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_02d990404652d63d0712ecd493"`,
    );
    await queryRunner.query(`DROP TABLE "knowledgexcustomer"`);
  }
}
