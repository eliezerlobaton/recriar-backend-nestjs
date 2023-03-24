/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class illnessxcondition1654697829422 implements MigrationInterface {
    name = 'illnessxcondition1654697829422';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "illness" DROP CONSTRAINT "FK_89457f0bfbc94ad2ca4ecb4698f"`,
        );
        await queryRunner.query(
            `CREATE TABLE "illnessxcondition" ("illnessid" uuid NOT NULL, "conditionid" uuid NOT NULL, CONSTRAINT "PK_3ed37cdddb62c7705ab5c80d295" PRIMARY KEY ("illnessid", "conditionid"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_2c9e9f95928b40fc8b0e34d05e" ON "illnessxcondition" ("illnessid") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_a83c0013cc07157dfd0757e267" ON "illnessxcondition" ("conditionid") `,
        );
        await queryRunner.query(`ALTER TABLE "illness" DROP COLUMN "conditionid"`);
        await queryRunner.query(
            `ALTER TABLE "illnessxcondition" ADD CONSTRAINT "FK_2c9e9f95928b40fc8b0e34d05e4" FOREIGN KEY ("illnessid") REFERENCES "illness"("illnessid") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "illnessxcondition" ADD CONSTRAINT "FK_a83c0013cc07157dfd0757e2673" FOREIGN KEY ("conditionid") REFERENCES "condition"("conditionid") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "illnessxcondition" DROP CONSTRAINT "FK_a83c0013cc07157dfd0757e2673"`,
        );
        await queryRunner.query(
            `ALTER TABLE "illnessxcondition" DROP CONSTRAINT "FK_2c9e9f95928b40fc8b0e34d05e4"`,
        );
        await queryRunner.query(`ALTER TABLE "illness" ADD "conditionid" uuid`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_a83c0013cc07157dfd0757e267"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_2c9e9f95928b40fc8b0e34d05e"`,
        );
        await queryRunner.query(`DROP TABLE "illnessxcondition"`);
        await queryRunner.query(
            `CREATE INDEX "IX_knowledge_integrationid" ON "knowledge" ("integrationid") `,
        );
        await queryRunner.query(
            `ALTER TABLE "illness" ADD CONSTRAINT "FK_89457f0bfbc94ad2ca4ecb4698f" FOREIGN KEY ("conditionid") REFERENCES "condition"("conditionid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
