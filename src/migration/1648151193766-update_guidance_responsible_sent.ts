import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateGuidanceResponsibleSent1648151193766
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "guidance" AS "g1"
        SET "responsible"=(SELECT "customerid" FROM "guidance" AS "g2" WHERE "g1"."customerid" = "g2"."customerid" LIMIT 1 ), "sent_by"=(SELECT "squaduserid" FROM "squaduser" WHERE "squaduser"."name" ~* 'Marciano' or "squaduser"."name" ~* 'sfsdf' LIMIT 1 )
        WHERE "g1"."responsible" IS NULL AND "g1"."sent_by" IS NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "guidance" SET "responsible" = NULL, "sent_by" = NULL`,
    );
  }
}
