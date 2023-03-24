import { MigrationInterface, QueryRunner } from 'typeorm';

export class scheduledAttendanceFixReason1651528526424
  implements MigrationInterface
{
  name = 'scheduledAttendanceFixReason1651528526424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ADD "reason" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ALTER COLUMN "attendance_url" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ALTER COLUMN "recording_url" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ALTER COLUMN "recording_url" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ALTER COLUMN "attendance_url" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" DROP COLUMN "reason"`,
    );
  }
}
