import { MigrationInterface, QueryRunner } from 'typeorm';

export class contentSubmissionObjectiveid1646742981624
  implements MigrationInterface
{
  name = 'contentSubmissionObjectiveid1646742981624';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IX_knowledge_integrationid"`);
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD "knowledge_objectiveid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP CONSTRAINT "FK_6f9b95365824cd9cad17ee7e089"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD CONSTRAINT "FK_6f9b95365824cd9cad17ee7e089" FOREIGN KEY ("knowledgeid") REFERENCES "knowledge"("knowledgeid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD CONSTRAINT "FK_f4561b4d116fa016f25eef1d3b6" FOREIGN KEY ("knowledge_objectiveid") REFERENCES "knowledge_objective"("knowledge_objectiveid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP CONSTRAINT "FK_f4561b4d116fa016f25eef1d3b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP CONSTRAINT "FK_6f9b95365824cd9cad17ee7e089"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" ADD CONSTRAINT "FK_6f9b95365824cd9cad17ee7e089" FOREIGN KEY ("knowledgeid") REFERENCES "knowledge"("knowledgeid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_submission" DROP COLUMN "knowledge_objectiveid"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_knowledge_integrationid" ON "knowledge" ("integrationid") `,
    );
  }
}
