import { MigrationInterface, QueryRunner } from 'typeorm';

export class addEventIdAttendance1652299770203 implements MigrationInterface {
  name = 'addEventIdAttendance1652299770203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ADD "event_id" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" DROP COLUMN "event_id"`,
    );
  }
}
