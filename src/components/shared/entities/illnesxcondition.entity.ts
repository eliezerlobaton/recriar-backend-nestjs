import { ViewEntity, ViewColumn, Connection } from 'typeorm';

@ViewEntity({
  expression: (connection: Connection) =>
    connection
      .createQueryBuilder()
      .select('condition.conditionid', 'conditionid')
      .addSelect('condition.description', 'description_condition')
      .addSelect('condition.integrationid', 'integrationid_condition')
      .addSelect('condition.factorid', 'factorid')
      .addSelect('condition.comorbityid', 'comorbityid')
      .addSelect('condition.tenantid', 'tenantid_condition')
      .addSelect('illness.description', 'description_illness')
      .addSelect('illness.integrationid', 'integrationid_illness')
      .addSelect('illness.tenantid', 'tenantid_illness')
      .addSelect('illness.illnessid', 'illnessid')
      .from('condition', 'condition')
      .innerJoin(
        'illnessxcondition',
        'illnessxcondition',
        'illnessxcondition.conditionid = condition.conditionid',
      )
      .innerJoin(
        'illness',
        'illness',
        'illness.illnessid = illnessxcondition.illnessid',
      ),
  name: 'illnessxconditionview',
})
export class IllnessXConditionEntity {
  @ViewColumn()
  conditionid: string;

  @ViewColumn()
  description_condition: string;

  @ViewColumn()
  integrationid_condition: string;

  @ViewColumn()
  factorid: string;

  @ViewColumn()
  comorbityid: string;

  @ViewColumn()
  tenantid_condition: string;

  @ViewColumn()
  description_illness: string;

  @ViewColumn()
  integrationid_illness: string;

  @ViewColumn()
  tenantid_illness: string;

  @ViewColumn()
  illnessid: string;
}
