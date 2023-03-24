import { MigrationInterface, QueryRunner } from 'typeorm';

export class myInit1644867013930 implements MigrationInterface {
  name = 'myInit1644867013930';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "knowledge_submission" ("isactive" boolean NOT NULL DEFAULT true, "isarchived" boolean NOT NULL DEFAULT false, "createat" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateat" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "knowledge_submissionid" uuid NOT NULL DEFAULT uuid_generate_v4(), "squad_userid" character varying NOT NULL, "status" character varying(15) NOT NULL, "answer" int4range NOT NULL, "answer_date" TIMESTAMP NOT NULL, "send_date" TIMESTAMP NOT NULL, "customerCustomerid" uuid, "knowledgeKnowledgeid" uuid, CONSTRAINT "PK_53f4aa4d5e5b1a8edb68d3e22ba" PRIMARY KEY ("knowledge_submissionid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD CONSTRAINT "FK_00955eb372f4f1a70586b2139dd" FOREIGN KEY ("customerCustomerid") REFERENCES "customer"("customerid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD CONSTRAINT "FK_e40f83f48ee789dc4e04ae94ffa" FOREIGN KEY ("knowledgeKnowledgeid") REFERENCES "knowledge"("knowledgeid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP CONSTRAINT "FK_e40f83f48ee789dc4e04ae94ffa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP CONSTRAINT "FK_00955eb372f4f1a70586b2139dd"`,
    );
    await queryRunner.query(`DROP TABLE "knowledge_submission"`);
  }
}
