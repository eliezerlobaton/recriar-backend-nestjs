import {MigrationInterface, QueryRunner} from "typeorm";

export class illnessxconditionview1656015022471 implements MigrationInterface {
    name = 'illnessxconditionview1656015022471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE VIEW "illnessxconditionview" AS SELECT "condition"."conditionid" AS "conditionid", "illness"."tenantid" AS "tenantid_illness", "illness"."illnessid" AS "illnessid", "illness"."integrationid" AS "integrationid_illness", "illness"."description" AS "description_illness", condition.description AS "description_condition", condition.integrationid AS "integrationid_condition", condition.factorid AS "factorid", condition.comorbityid AS "comorbityid", condition.tenantid AS "tenantid_condition" FROM "condition" "condition" INNER JOIN "illnessxcondition" "illnessxcondition" ON "illnessxcondition"."conditionid" = "condition"."conditionid"  INNER JOIN "illness" "illness" ON  "illness"."illnessid" = "illnessxcondition"."illnessid" AND "illness"."deletiondate" IS NULL`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","illnessxconditionview","SELECT \"condition\".\"conditionid\" AS \"conditionid\", \"illness\".\"tenantid\" AS \"tenantid_illness\", \"illness\".\"illnessid\" AS \"illnessid\", \"illness\".\"integrationid\" AS \"integrationid_illness\", \"illness\".\"description\" AS \"description_illness\", condition.description AS \"description_condition\", condition.integrationid AS \"integrationid_condition\", condition.factorid AS \"factorid\", condition.comorbityid AS \"comorbityid\", condition.tenantid AS \"tenantid_condition\" FROM \"condition\" \"condition\" INNER JOIN \"illnessxcondition\" \"illnessxcondition\" ON \"illnessxcondition\".\"conditionid\" = \"condition\".\"conditionid\"  INNER JOIN \"illness\" \"illness\" ON  \"illness\".\"illnessid\" = \"illnessxcondition\".\"illnessid\" AND \"illness\".\"deletiondate\" IS NULL"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","illnessxconditionview","public"]);
        await queryRunner.query(`DROP VIEW "illnessxconditionview"`);
    }

}
