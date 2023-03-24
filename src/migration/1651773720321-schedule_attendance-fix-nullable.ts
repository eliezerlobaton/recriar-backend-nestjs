import { MigrationInterface, QueryRunner } from 'typeorm';

export class scheduleAttendanceFixNullable1651773720321
  implements MigrationInterface
{
  name = 'scheduleAttendanceFixNullable1651773720321';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ALTER COLUMN "attendance_url" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ALTER COLUMN "recording_url" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ALTER COLUMN "recording_url" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ALTER COLUMN "attendance_url" SET NOT NULL`,
    );
  }
}
