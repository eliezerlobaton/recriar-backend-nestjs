import { MigrationInterface, QueryRunner } from 'typeorm';

export class knowledgeSubmissionAddObjectiveid1646664909605
  implements MigrationInterface
{
  name = 'knowledgeSubmissionAddObjectiveid1646664909605';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD "knowledge_objectiveid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP CONSTRAINT "FK_6d12bf63da455e660b0bec00edf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD CONSTRAINT "FK_6d12bf63da455e660b0bec00edf" FOREIGN KEY ("knowledgeid") REFERENCES "knowledge"("knowledgeid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD CONSTRAINT "FK_dc8b5052186bbb9e34c60ef775f" FOREIGN KEY ("knowledge_objectiveid") REFERENCES "knowledge_objective"("knowledge_objectiveid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP CONSTRAINT "FK_dc8b5052186bbb9e34c60ef775f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP CONSTRAINT "FK_6d12bf63da455e660b0bec00edf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" ADD CONSTRAINT "FK_6d12bf63da455e660b0bec00edf" FOREIGN KEY ("knowledgeid") REFERENCES "knowledge"("knowledgeid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_submission" DROP COLUMN "knowledge_objectiveid"`,
    );
  }
}
