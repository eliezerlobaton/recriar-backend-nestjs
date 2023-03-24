export class LSQuestionAndAnswerDTO {
  question: string;
  answer: string;

  public static fromEntity(
    question: string,
    answer: string,
  ): LSQuestionAndAnswerDTO {
    const newDTO = new LSQuestionAndAnswerDTO();
    newDTO.question = question;
    newDTO.answer = answer;
    return newDTO;
  }
}
