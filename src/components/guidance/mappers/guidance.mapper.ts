import { capitalizeString } from 'src/components/shared/lib/common-functions';
import { Mapper } from 'src/components/shared/mappers/mapper';
import { GuidanceDTO } from '../dto/guidance.dto';
import { GuidanceEntity } from '../entities/guidance.entity';

export class GuidanceMapper extends Mapper<GuidanceEntity, GuidanceDTO> {
  mapFrom(param: GuidanceEntity): GuidanceDTO {
    const cpf = param.customer.cpf.replace(/[^0-9]/, '');
    const link = param.behavior.link
      ? param.behavior.link.replace(/=(CPF)*/g, `=${cpf}`)
      : param.behavior.link;
    return {
      description: param.behavior.description,
      type: param.behavior.behavior_type,
      result: [
        ...(param.result
          ? param.result.split('\n').map((result) => capitalizeString(result))
          : []),
      ],
      sendDate: param.send_date,
      answerDate: param.answer_date,
      id: param.guidanceid,
      behaviorId: param.behavior.behaviorid,
      customerId: param.customer.customerid,
      answers: param.questionsxanswers,
      status: param.status,
      alreadySent: false,
      link,
      sentBy: param.sent_by ? param.sent_by.name : '',
      responsible: (<any>param.responsible).name,
      reponsibleId: (<any>param.responsible).id,
    };
  }

  mapTo(param: GuidanceDTO): GuidanceEntity {
    const entity = new GuidanceEntity();
    entity.guidanceid = param.id;
    entity.behavior = <any>param.behaviorId;
    entity.customer = <any>param.customerId;
    entity.result = param.result.join('\n');
    entity.answer_date = param.answerDate;
    entity.send_date = param.sendDate;
    return entity;
  }
}
