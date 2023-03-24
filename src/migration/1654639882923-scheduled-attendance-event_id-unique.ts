import { MigrationInterface, QueryRunner } from 'typeorm';

export class scheduledAttendanceEventIdUnique1654639882923
  implements MigrationInterface
{
  name = 'scheduledAttendanceEventIdUnique1654639882923';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE public.scheduled_attendance SET event_id = uuid_generate_v4() WHERE scheduled_attendanceid NOT IN (SELECT DISTINCT ON (event_id) scheduled_attendanceid FROM public.scheduled_attendance);`,
    );

    await queryRunner.query(
      `UPDATE public.scheduled_attendance SET event_id=uuid_generate_v4() WHERE event_id is null;`,
    );

    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ALTER COLUMN "event_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ADD CONSTRAINT "UQ_6d5655f01d6b217808ff3abc387" UNIQUE ("event_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" DROP CONSTRAINT "UQ_6d5655f01d6b217808ff3abc387"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ALTER COLUMN "event_id" DROP NOT NULL`,
    );
  }
}
