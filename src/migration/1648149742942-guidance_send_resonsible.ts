import {MigrationInterface, QueryRunner} from "typeorm";

export class guidanceSendResonsible1648149742942 implements MigrationInterface {
    name = 'guidanceSendResonsible1648149742942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guidance" ADD "responsible" uuid`);
        await queryRunner.query(`ALTER TABLE "guidance" ADD "sent_by" uuid`);
        await queryRunner.query(`ALTER TABLE "guidance" ADD CONSTRAINT "FK_1418c743c0edfa0c160e69014b0" FOREIGN KEY ("sent_by") REFERENCES "squaduser"("squaduserid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guidance" DROP CONSTRAINT "FK_1418c743c0edfa0c160e69014b0"`);
        await queryRunner.query(`ALTER TABLE "guidance" DROP COLUMN "sent_by"`);
        await queryRunner.query(`ALTER TABLE "guidance" DROP COLUMN "responsible"`);
    }

}
