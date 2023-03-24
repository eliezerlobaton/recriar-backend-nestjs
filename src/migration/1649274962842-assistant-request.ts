import { MigrationInterface, QueryRunner } from 'typeorm';

export class assistantRequest1649274962842 implements MigrationInterface {
  name = 'assistantRequest1649274962842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "assistant_request" ("tenantid" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "creationdate" TIMESTAMP NOT NULL DEFAULT now(), "lastmodificationdate" TIMESTAMP DEFAULT now(), "deletiondate" TIMESTAMP, "creationuserid" uuid, "lastmodificationuserid" uuid, "deletionuserid" uuid, "assistant_requestid" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_date" TIMESTAMP NOT NULL DEFAULT now(), "end_date" TIMESTAMP NOT NULL, "responsible_message" text NOT NULL, "customerid" uuid, "assistantid" uuid, "responsibleid" uuid, CONSTRAINT "PK_ecdda1d7a6c140acbe54ebbfc10" PRIMARY KEY ("assistant_requestid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "assistant_request" ADD CONSTRAINT "FK_5fccee42cc771a350e961154885" FOREIGN KEY ("customerid") REFERENCES "customer"("customerid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assistant_request" ADD CONSTRAINT "FK_1ac0b1bda541d40f0523504c4de" FOREIGN KEY ("assistantid") REFERENCES "squaduser"("squaduserid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assistant_request" ADD CONSTRAINT "FK_3f2582458c14c996b0ab0d0c08f" FOREIGN KEY ("responsibleid") REFERENCES "squaduser"("squaduserid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assistant_request" DROP CONSTRAINT "FK_3f2582458c14c996b0ab0d0c08f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assistant_request" DROP CONSTRAINT "FK_1ac0b1bda541d40f0523504c4de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assistant_request" DROP CONSTRAINT "FK_5fccee42cc771a350e961154885"`,
    );
    await queryRunner.query(`DROP TABLE "assistant_request"`);
  }
}
