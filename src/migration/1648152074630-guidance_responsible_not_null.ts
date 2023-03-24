import {MigrationInterface, QueryRunner} from "typeorm";

export class guidanceResponsibleNotNull1648152074630 implements MigrationInterface {
    name = 'guidanceResponsibleNotNull1648152074630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guidance" ALTER COLUMN "responsible" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guidance" ALTER COLUMN "responsible" DROP NOT NULL`);
    }

}
