import { AppStatus } from 'src/components/shared/dto/enums/common-enum';
import { LSQuestionAndAnswerDTO } from 'src/components/shared/dto/question-n-anwser.dto';
import { GuidanceEntity } from '../entities/guidance.entity';

export class SaveResultDTO {
  id: string;
  result: string;
  questionsxanswers: LSQuestionAndAnswerDTO[];
  status: AppStatus;

  public static fromDTO(saveDto: SaveResultDTO): GuidanceEntity {
    const entity = new GuidanceEntity();
    entity.guidanceid = saveDto.id;
    entity.result = saveDto.result;
    entity.answer_date = new Date();
    entity.status = saveDto.status;
    entity.questionsxanswers = saveDto.questionsxanswers;
    return entity;
  }
}
