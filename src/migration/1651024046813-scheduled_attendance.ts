import { MigrationInterface, QueryRunner } from 'typeorm';

export class scheduledAttendance1651024046813 implements MigrationInterface {
  name = 'scheduledAttendance1651024046813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "scheduled_attendance" ("tenantid" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "creationdate" TIMESTAMP NOT NULL DEFAULT now(), "lastmodificationdate" TIMESTAMP DEFAULT now(), "deletiondate" TIMESTAMP, "creationuserid" uuid, "lastmodificationuserid" uuid, "deletionuserid" uuid, "scheduled_attendanceid" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_uri" text NOT NULL, "name" text NOT NULL, "status" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "event_type" text NOT NULL, "attendance_url" text NOT NULL, "recording_url" text NOT NULL, "squaduserid" uuid, "customerid" uuid, CONSTRAINT "PK_b417489462c637701f8e774036d" PRIMARY KEY ("scheduled_attendanceid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ADD CONSTRAINT "FK_15e158c12d94c8ce1daf1a057ad" FOREIGN KEY ("squaduserid") REFERENCES "squaduser"("squaduserid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" ADD CONSTRAINT "FK_6b059bafdbc2f2ee930b0ce2876" FOREIGN KEY ("customerid") REFERENCES "customer"("customerid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" DROP CONSTRAINT "FK_6b059bafdbc2f2ee930b0ce2876"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_attendance" DROP CONSTRAINT "FK_15e158c12d94c8ce1daf1a057ad"`,
    );
    await queryRunner.query(`DROP TABLE "scheduled_attendance"`);
  }
}
