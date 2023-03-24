import { MigrationInterface, QueryRunner } from 'typeorm';

export class guidanceEnableNullOnSentby1653670708684
  implements MigrationInterface
{
  name = 'guidanceEnableNullOnSentby1653670708684';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guidance" DROP CONSTRAINT "FK_1418c743c0edfa0c160e69014b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guidance" ADD CONSTRAINT "FK_1418c743c0edfa0c160e69014b0" FOREIGN KEY ("sent_by") REFERENCES "squaduser"("squaduserid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guidance" DROP CONSTRAINT "FK_1418c743c0edfa0c160e69014b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guidance" ADD CONSTRAINT "FK_1418c743c0edfa0c160e69014b0" FOREIGN KEY ("sent_by") REFERENCES "squaduser"("squaduserid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
