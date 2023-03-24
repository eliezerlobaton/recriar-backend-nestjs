import { MigrationInterface, QueryRunner } from 'typeorm';

export class guidanceQuestionxanswers1647379424125
  implements MigrationInterface
{
  name = 'guidanceQuestionxanswers1647379424125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guidance" ADD "questionsxanswers" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guidance" DROP COLUMN "questionsxanswers"`,
    );
  }
}
