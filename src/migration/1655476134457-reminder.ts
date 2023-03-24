import { MigrationInterface, QueryRunner } from 'typeorm';

export class reminder1655476134457 implements MigrationInterface {
  name = 'reminder1655476134457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reminder" ADD "customerid" uuid`);
    await queryRunner.query(`ALTER TABLE "reminder" ADD "squaduserid" uuid`);
    await queryRunner.query(
      `ALTER TABLE "reminder" ADD CONSTRAINT "FK_8aea8c288b3642f22248579d6e4" FOREIGN KEY ("customerid") REFERENCES "customer"("customerid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" ADD CONSTRAINT "FK_b09df209026aefe9ccb35fc803f" FOREIGN KEY ("squaduserid") REFERENCES "squaduser"("squaduserid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reminder" DROP CONSTRAINT "FK_b09df209026aefe9ccb35fc803f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" DROP CONSTRAINT "FK_8aea8c288b3642f22248579d6e4"`,
    );
    await queryRunner.query(`ALTER TABLE "reminder" DROP COLUMN "squaduserid"`);
    await queryRunner.query(`ALTER TABLE "reminder" DROP COLUMN "customerid"`);
  }
}
