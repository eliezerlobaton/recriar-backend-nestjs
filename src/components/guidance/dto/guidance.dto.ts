import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BehaviorEntity } from 'src/components/behavior/entities/behavior.entity';
import { BehaviorType } from 'src/components/behavior/enum/behavior-type.enum';
import { AppStatus } from 'src/components/shared/dto/enums/common-enum';
import { capitalizeString } from 'src/components/shared/lib/common-functions';
import { GuidanceEntity } from '../entities/guidance.entity';
import { SurveyResultDTO } from './survey-result.dto';

export class GuidanceDTO {
  @ApiProperty({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  behaviorId?: string;

  @ApiProperty({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: BehaviorType })
  @IsNotEmpty()
  @IsEnum(BehaviorType, {
    message: `Type value must be one of these: ${Object.values(
      BehaviorType,
    ).join()}`,
  })
  type: BehaviorType;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  sendDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  answerDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  result?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  surveyResults?: SurveyResultDTO[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  alreadySent: boolean;

  @ApiProperty()
  answers?: any;

  @ApiProperty({ enum: AppStatus })
  @IsNotEmpty()
  @IsEnum(AppStatus, {
    message: `Status value must be one of these: ${Object.values(
      AppStatus,
    ).join()}`,
  })
  status?: AppStatus;

  @ApiProperty()
  link?: string;

  @ApiProperty()
  sentBy: string;

  @ApiProperty()
  reponsibleId: string;

  @ApiProperty()
  responsible: string;

  static fromDTO(dto: GuidanceDTO): GuidanceEntity {
    const entity = new GuidanceEntity();
    entity.guidanceid = dto.id;
    entity.behavior = <any>dto.behaviorId;
    entity.customer = <any>dto.customerId;
    entity.result = dto.result.join('\n');
    entity.answer_date = dto.answerDate;
    entity.send_date = dto.sendDate;
    return entity;
  }

  static fromEntity(entity: GuidanceEntity): GuidanceDTO {
    const cpf = entity.customer.cpf.replace(/[^0-9]/, '');
    const link = entity.behavior.link
      ? entity.behavior.link.replace(/=(CPF)*/g, `=${cpf}`)
      : entity.behavior.link;
    return {
      description: entity.behavior.description,
      type: entity.behavior.behavior_type,
      result: [
        ...(entity.result
          ? entity.result.split('\n').map((result) => capitalizeString(result))
          : []),
      ],
      sendDate: entity.send_date,
      answerDate: entity.answer_date,
      id: entity.guidanceid,
      behaviorId: entity.behavior.behaviorid,
      customerId: entity.customer.customerid,
      answers: entity.questionsxanswers,
      status: entity.status,
      alreadySent: false,
      link,
      sentBy: entity.sent_by ? entity.sent_by.name : '',
      responsible: (<any>entity.responsible).name,
      reponsibleId: (<any>entity.responsible).id,
    };
  }

  static fromBehaviorEntity(entity: BehaviorEntity): GuidanceDTO {
    return {
      behaviorId: entity.behaviorid,
      description: entity.description,
      type: entity.behavior_type,
      alreadySent: false,
      id: null,
      customerId: null,
      status: AppStatus.NotSend,
      result: null,
      answers: null,
      sendDate: null,
      answerDate: null,
      link: null,
      sentBy: null,
      responsible: null,
      reponsibleId: null,
    };
  }
}
