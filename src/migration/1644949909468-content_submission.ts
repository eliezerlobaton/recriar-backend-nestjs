import { MigrationInterface, QueryRunner } from 'typeorm';

export class contentSubmission1644949909468 implements MigrationInterface {
  name = 'contentSubmission1644949909468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP CONSTRAINT "FK_00955eb372f4f1a70586b2139dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP CONSTRAINT "FK_e40f83f48ee789dc4e04ae94ffa"`,
    );
    await queryRunner.query(
      `CREATE TABLE "content_submission" ("isactive" boolean NOT NULL DEFAULT true, "isarchived" boolean NOT NULL DEFAULT false, "createat" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateat" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "content_submissionid" uuid NOT NULL DEFAULT uuid_generate_v4(), "squad_userid" character varying NOT NULL, "status" character varying(15) NOT NULL, "send_date" TIMESTAMP NOT NULL, "reading_date" TIMESTAMP NOT NULL, "contentid" uuid, "customerid" uuid, CONSTRAINT "PK_4e3f3d8c83fae7c1c9d17a424e6" PRIMARY KEY ("content_submissionid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "customerCustomerid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "knowledgeKnowledgeid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "customerid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "knowledgeid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD CONSTRAINT "FK_829823ad77f9c1a1081e47aa3fa" FOREIGN KEY ("contentid") REFERENCES "content"("contentid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD CONSTRAINT "FK_4fa4d60123bf72cbba79fa0a9a5" FOREIGN KEY ("customerid") REFERENCES "customer"("customerid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD CONSTRAINT "FK_e2668465d89ca85d5567954d277" FOREIGN KEY ("customerid") REFERENCES "customer"("customerid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD CONSTRAINT "FK_6d12bf63da455e660b0bec00edf" FOREIGN KEY ("knowledgeid") REFERENCES "knowledge"("knowledgeid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP CONSTRAINT "FK_6d12bf63da455e660b0bec00edf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP CONSTRAINT "FK_e2668465d89ca85d5567954d277"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP CONSTRAINT "FK_4fa4d60123bf72cbba79fa0a9a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP CONSTRAINT "FK_829823ad77f9c1a1081e47aa3fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "knowledgeid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "customerid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "knowledgeKnowledgeid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "customerCustomerid" uuid`,
    );
    await queryRunner.query(`DROP TABLE "content_submission"`);
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD CONSTRAINT "FK_e40f83f48ee789dc4e04ae94ffa" FOREIGN KEY ("knowledgeKnowledgeid") REFERENCES "knowledge"("knowledgeid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD CONSTRAINT "FK_00955eb372f4f1a70586b2139dd" FOREIGN KEY ("customerCustomerid") REFERENCES "customer"("customerid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
