import { Gender } from 'src/components/shared/dto/enums/common-enum';

export class BaseSurveyAnswerDTO {
  gender: Gender;
  answers: { question: string; answer: string }[];
}
