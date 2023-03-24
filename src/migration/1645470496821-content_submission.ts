import {MigrationInterface, QueryRunner} from "typeorm";

export class contentSubmission1645470496821 implements MigrationInterface {
    name = 'contentSubmission1645470496821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_submission" DROP COLUMN "answer"`);
        await queryRunner.query(`ALTER TABLE "content_submission" DROP COLUMN "answer_date"`);
        await queryRunner.query(`ALTER TABLE "content_submission" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "content_submission" ADD "answer" integer`);
        await queryRunner.query(`ALTER TABLE "content_submission" ADD "answer_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "content_submission" ADD "rating" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_submission" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "content_submission" DROP COLUMN "answer_date"`);
        await queryRunner.query(`ALTER TABLE "content_submission" DROP COLUMN "answer"`);
        await queryRunner.query(`ALTER TABLE "content_submission" ADD "rating" int4range`);
        await queryRunner.query(`ALTER TABLE "content_submission" ADD "answer_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "content_submission" ADD "answer" int4range`);
    }

}
