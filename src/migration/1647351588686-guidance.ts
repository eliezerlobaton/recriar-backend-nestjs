import { MigrationInterface, QueryRunner } from 'typeorm';

export class guidance1647351588686 implements MigrationInterface {
  name = 'guidance1647351588686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "guidance" ("tenantid" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "creationdate" TIMESTAMP NOT NULL DEFAULT now(), "lastmodificationdate" TIMESTAMP DEFAULT now(), "deletiondate" TIMESTAMP, "creationuserid" uuid, "lastmodificationuserid" uuid, "deletionuserid" uuid, "guidanceid" uuid NOT NULL DEFAULT uuid_generate_v4(), "send_date" TIMESTAMP NOT NULL DEFAULT now(), "answer_date" TIMESTAMP, "result" character varying, "customerid" uuid, "behaviorid" uuid, CONSTRAINT "PK_18ec53e181d7db5a8e665c8cdeb" PRIMARY KEY ("guidanceid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "guidance" ADD CONSTRAINT "FK_f7284f32564623fad6cb9a39cbd" FOREIGN KEY ("customerid") REFERENCES "customer"("customerid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guidance" ADD CONSTRAINT "FK_3bcd89150791c1712d6c61ed1dd" FOREIGN KEY ("behaviorid") REFERENCES "behavior"("behaviorid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guidance" DROP CONSTRAINT "FK_3bcd89150791c1712d6c61ed1dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guidance" DROP CONSTRAINT "FK_f7284f32564623fad6cb9a39cbd"`,
    );
    await queryRunner.query(`DROP TABLE "guidance"`);
  }
}
