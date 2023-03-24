import { MigrationInterface, QueryRunner } from 'typeorm';

export class illness1653660274033 implements MigrationInterface {
  name = 'illness1653660274033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "illness" ADD COLUMN "conditionid" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "illness" ADD CONSTRAINT "FK_89457f0bfbc94ad2ca4ecb4698f" FOREIGN KEY ("conditionid") REFERENCES "condition"("conditionid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "illness" DROP CONSTRAINT "FK_89457f0bfbc94ad2ca4ecb4698f"`,
    );

    await queryRunner.query(`ALTER TABLE "illness" DROP COLUMN "conditionid"`);
  }
}
