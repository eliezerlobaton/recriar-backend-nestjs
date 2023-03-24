import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TaskTypeEnum } from '../shared/dto/enums/task-type.enum';
import { AssistantTasksRawDataDTO } from './dto/assistant-tasks-raw-data.dto';
import { AssistantTasksDTO } from './dto/assistant-tasks.dto';
import { CustomerWithoutPendingTasksRawDataDTO } from './dto/customer-wo-pending-raw-data.dto';
import { CustomerWithoutPendingTasksDTO } from './dto/customer-wo-pending.dto';
import { PendingAndNotPendingTasksDTO } from './dto/pending-and-not-pending-tasks.dto';
import { ResponsibleTasksRawDataDTO } from './dto/responsible-tasks-raw-data.dto';
import { ResponsibleTasksDTO } from './dto/responsible-tasks.dto';
import { PanelServiceInterface } from './interfaces/panel.service.interface';

@Injectable()
export class PanelService implements PanelServiceInterface {
  constructor(private readonly dbService: DatabaseService) {}

  private getKnowledgeSubmissionQuery() {
    const knowledgeSubmissionQuery = this.dbService
      .getDbHandle()
      .createQueryBuilder();

    knowledgeSubmissionQuery
      .select([
        `ks.customerid::varchar AS customerid`,
        `'${TaskTypeEnum.knowledgeSubmissionAnswer}' as tasktype`,
        `ks.knowledgeid::varchar as taskid`,
        `k.description as taskdescription`,
        `ks.send_date::varchar AS send_date`,
        `ks.squad_userid::varchar as squad_userid`,
      ])
      .from('knowledge_submission', 'ks')
      .innerJoin(
        'knowledge',
        'k',
        `ks.knowledgeid = k.knowledgeid
          AND ks.deletiondate IS null
          AND ks.answer IS null`,
      );
    return knowledgeSubmissionQuery.getQuery();
  }

  private getContentSubmissionQuery() {
    const contentSubmissionQuery = this.dbService
      .getDbHandle()
      .createQueryBuilder();

    contentSubmissionQuery
      .select([
        `cs.customerid::varchar as customerid`,
        `'${TaskTypeEnum.contentSubmissionRating}' AS tasktype`,
        `cs.contentid::varchar as taskid`,
        `cnt.title as taskdescription`,
        `cs.send_date::varchar as send_date`,
        `cs.squad_userid::varchar as squad_userid`,
      ])
      .from('content_submission', 'cs')
      .innerJoin(
        'content',
        'cnt',
        `cnt.contentid = cs.contentid
          AND cs.deletiondate IS null
          AND cs.rating IS null`,
      );
    return contentSubmissionQuery.getQuery();
  }

  private getHealthIndicatorQuery() {
    const indicatorQuery = this.dbService.getDbHandle().createQueryBuilder();

    indicatorQuery
      .select([
        'ci.customerid::varchar AS customerid',
        `'${TaskTypeEnum.indicatorAnswer}' as tasktype`,
        'i.indicatorid::varchar AS taskid',
        'i.description AS taskdescription',
        'ci.date::varchar AS send_date',
        'ci.responsible::varchar AS squad_userid',
      ])
      .from('customerxindicator', 'ci')
      .innerJoin(
        'indicatorxobjectives',
        'io',
        `io.indicatorxobjectivesid = ci.indicatorxobjectiveid
          AND ci.lastmodificationdate IS NULL
          AND ci.answer = 0
          AND io.deletiondate is null`,
      )
      .innerJoin(
        'indicator',
        'i',
        `i.indicatorid = io.indicatorid
          AND i.deletiondate IS NULL`,
      );
    return indicatorQuery.getQuery();
  }

  private getActivityQuery() {
    const activityQuery = this.dbService.getDbHandle().createQueryBuilder();
    activityQuery
      .select([
        `ac.customerid::varchar AS customerid`,
        `'${TaskTypeEnum.activityAnswer}' AS tasktype`,
        `ac.activityid::varchar AS taskid`,
        `act.description AS taskdescription`,
        `ca.enddate::varchar AS send_date`,
        `ac.responsible::varchar AS squad_userid`,
      ])
      .from('customeractivity', 'ca')
      .innerJoin(
        'activitiesxcustomer',
        'ac',
        `ac.activitiesxcustomerid = ca.activityxcustomerid 
          AND ac.deletiondate IS NULL`,
      )
      .innerJoin(
        'activities',
        'act',
        `act.activityid = ac.activityid
          AND act.deletiondate IS NULL`,
      )
      .where(
        `ca.status = 'Pending'
          AND ca.enddate < CURRENT_DATE
          AND ca.deletiondate IS NULL`,
      );
    return activityQuery.getQuery();
  }

  private getBehaviorQuery() {
    const behaviorQuery = this.dbService.getDbHandle().createQueryBuilder();

    behaviorQuery
      .select([
        `g.customerid::varchar AS customerid`,
        `'${TaskTypeEnum.behaviorAnswer}' AS tasktype`,
        `g.behaviorid::varchar AS taskid`,
        `b.description AS taskdescription`,
        `g.send_date::varchar AS send_date`,
        `g.sent_by::varchar AS squad_userid`,
      ])
      .from('guidance', 'g')
      .innerJoin(
        'behavior',
        'b',
        `b.behaviorid = g.behaviorid 
          AND b.deletiondate IS NULL`,
      ).where(`g.status = 'Pending' 
          AND g.answer_date IS NULL`);
    return behaviorQuery.getQuery();
  }

  private async getCustomersWithoutPendingQuery(
    assistantId: string,
    customersWithTasks: string[] = null,
  ): Promise<CustomerWithoutPendingTasksRawDataDTO[]> {
    const query = this.dbService.getDbHandle().createQueryBuilder();
    query
      .select([
        'c.customerid AS customerid',
        'c.name AS customername',
        'su.squaduserid AS responsibleid',
        `CONCAT(su.name, ' - ', su.functionalrole) AS responsiblename`,
      ])
      .from('assistant_request', 'ar')
      .innerJoin(
        'customer',
        'c',
        `c.customerid = ar.customerid 
          AND c.deletiondate IS NULL`,
        {
          customersToAvoid: customersWithTasks,
        },
      )
      .innerJoin(
        'squaduser',
        'su',
        `ar.responsibleid IS NOT NULL
        AND su.squaduserid = ar.responsibleid
        AND su.deletiondate IS NULL`,
      )
      .where(
        `ar.assistantid = :assistantid
        AND ar.customerid::varchar = ANY (ARRAY[:...customersToAvoid]::VARCHAR[])
        AND ar.start_date::timestamp <= CURRENT_DATE
        AND ar.end_date IS NULL
        AND ar.deletiondate IS NULL`,
        { assistantid: assistantId, customersToAvoid: customersWithTasks },
      );
    const result =
      await query.getRawMany<CustomerWithoutPendingTasksRawDataDTO>();
    return result;
  }

  private getAllTasksQuery() {
    return [
      this.getKnowledgeSubmissionQuery(),
      this.getContentSubmissionQuery(),
      this.getHealthIndicatorQuery(),
      this.getActivityQuery(),
      this.getBehaviorQuery(),
    ].join(' UNION ');
  }

  async getAllTasksByResponsible(
    responsibleId: string,
  ): Promise<ResponsibleTasksDTO[]> {
    const allTasksQuery = this.getAllTasksQuery();
    const query = await this.dbService.getDbHandle().createQueryBuilder();
    query
      .select([
        'task.customerid::varchar AS customerid',
        'task.taskid::varchar AS taskid',
        'task.tasktype, task.taskdescription',
        'task.squad_userid::varchar AS taskcreatorid',
        'task.send_date::varchar AS initialdate',
      ])
      .from(`(${allTasksQuery})`, 'task')
      .addSelect('c.name', 'customername')
      .addSelect(
        `
        CASE WHEN 
          (task.squad_userid::varchar = uuid_nil()::varchar or task.squad_userid = '')
        THEN 
          'Desconhecido'::varchar
        ELSE 
          CONCAT(s.name, ' - ', s.functionalrole)
        END`,
        'taskcreatorname',
      )
      .innerJoin(
        'teamsquad',
        'teamsquad',
        `teamsquad.customerid::varchar = task.customerid 
          AND teamsquad.squaduserid::varchar = :responsibleid 
          AND teamsquad.deletiondate IS null
          AND teamsquad.isresponsible = true`,
        {
          responsibleid: responsibleId,
        },
      )
      .innerJoin('customer', 'c', 'c.customerid::varchar = task.customerid')
      .leftJoin('squaduser', 's', 's.squaduserid::varchar = task.squad_userid');
    const result = await query.getRawMany<ResponsibleTasksRawDataDTO>();
    return result
      .map((task) => ResponsibleTasksDTO.fromRawData(task))
      .filter((task) => task.pendingDays > 0);
  }

  async getPendingTasksByAssistant(
    assistantId: string,
  ): Promise<PendingAndNotPendingTasksDTO> {
    const allTasksQuery = this.getAllTasksQuery();
    const query = this.dbService.getDbHandle().createQueryBuilder();

    query
      .select([
        'task.customerid::varchar AS customerid',
        'task.taskid::varchar AS taskid',
        'task.tasktype, task.taskdescription',
        'task.send_date::varchar AS initialdate',
      ])
      .from(`(${allTasksQuery})`, 'task')
      .addSelect('c.name', 'customername')
      .addSelect(
        `CASE WHEN 
        teamsquad.squaduserid::varchar = uuid_nil()::varchar or teamsquad.squaduserid is null
        THEN 
          'Desconhecido'::varchar
        ELSE 
          CONCAT(s.name, ' - ', s.functionalrole)
        END`,
        'responsiblename',
      )
      .addSelect('teamsquad.squaduserid', 'responsibleid')
      .innerJoin(
        'teamsquad',
        'teamsquad',
        `teamsquad.customerid::varchar = task.customerid 
          AND teamsquad.deletiondate IS null
          AND teamsquad.isresponsible = true`,
      )
      .innerJoin('customer', 'c', 'c.customerid::varchar = task.customerid')
      .leftJoin(
        'squaduser',
        's',
        's.squaduserid::varchar = teamsquad.squaduserid::varchar',
      )
      .innerJoin(
        'assistant_request',
        'ar',
        `ar.assistantid::varchar = task.squad_userid
        AND task.send_date::timestamp between ar.start_date and COALESCE(ar.end_date, CURRENT_DATE)
        AND ar.deletiondate is null`,
      )
      .where(`task.squad_userid = :assistantid`, { assistantid: assistantId });
    const result = await query.getRawMany<AssistantTasksRawDataDTO>();
    const customersIdsWithTasks = result.map((task) => task.customerid);
    const customersWithoutTasks = await this.getCustomersWithoutPendingQuery(
      assistantId,
      customersIdsWithTasks,
    );
    return {
      withPendingTasks: result
        .map((task) => AssistantTasksDTO.fromRawData(task))
        .filter((task) => task.pendingDays > 0),
      withoutPendingTasks: customersWithoutTasks.map((rawData) =>
        CustomerWithoutPendingTasksDTO.fromRawData(rawData),
      ),
    };
  }
}
