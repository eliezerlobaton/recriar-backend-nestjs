import { Inject, Injectable, Logger } from '@nestjs/common';
import { CustomerRepositoryInterface } from '../customer/interfaces/customer.repository.interface';
import { GuidanceEntity } from '../guidance/entities/guidance.entity';
import { GuidanceRepositoryInterface } from '../guidance/interfaces/guidance.repository.interface';
import { AppStatus, Gender } from '../shared/dto/enums/common-enum';
import { LimeSurveyIds } from '../shared/dto/enums/lime-suervey-ids';
import { LimeSurveyResponseRepositoryInterface } from '../shared/interfaces/lime-survey-reponse.repository.interface';
import { AuditCSurvey } from './surveys/audit-c.survey';
import { BaseSurveyAnswerDTO } from './surveys/base/dto/base.survey.answer.dto';
import { BaseInterfaceSurvey } from './surveys/base/interfaces/base.interface.form';
import { DdsSurvey } from './surveys/dds.survey';
import { GuidanceSurvyes } from './enum/form.enum';
import { GritSurvey } from './surveys/grit.survey';
import { FagerstromSurvey } from './surveys/fagerstrom.survey';
import { SurveyServiceInterface } from './interfaces/survey.service.interface';
import { IpacAdapSurvey } from './surveys/ipac-adap.survey';
import { IrisSruvey } from './surveys/iris.survey';
import { Phq9Survey } from './surveys/phq-9.survey';
import { MnaSurvey } from './surveys/mna.survey';
import { OceanSurvey } from './surveys/ocean.survey';
import { WhoqolASurvey } from './surveys/whoqol-a.survey';
import { AssistOmsSurvey } from './surveys/assist-oms.survey';
import { KatzSruvey } from './surveys/katz.survey';
import { AlimentacaoMsSurvey } from './surveys/alimentacao-ms.survey';
import { GuidanceServiceInterface } from '../guidance/interfaces/guidance.service.interface';
import { GuidanceDTO } from '../guidance/dto/guidance.dto';
import { AsaASurvey } from './surveys/asa-a.survey';

@Injectable()
export class SurveyService implements SurveyServiceInterface {
  private surveys = new Map();

  constructor(
    @Inject('GuidanceRepositoryInterface')
    private readonly guidanceRepostory: GuidanceRepositoryInterface,
    @Inject('GuidanceServiceInterface')
    private readonly guidanceService: GuidanceServiceInterface,
    @Inject('LimeSurveyResponseRepositoryInterface')
    private readonly limeSurveyResponseRepository: LimeSurveyResponseRepositoryInterface,
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly auditC: AuditCSurvey,
    private readonly phq9: Phq9Survey,
    private readonly ipacAdap: IpacAdapSurvey,
    private readonly dds: DdsSurvey,
    private readonly iris: IrisSruvey,
    private readonly mna: MnaSurvey,
    private readonly ocean: OceanSurvey,
    private readonly grit: GritSurvey,
    private readonly fagerstrom: FagerstromSurvey,
    private readonly whoqol: WhoqolASurvey,
    private readonly assist: AssistOmsSurvey,
    private readonly katz: KatzSruvey,
    private readonly alimentacaoMs: AlimentacaoMsSurvey,
    private readonly asaA: AsaASurvey,
  ) {
    this.surveys.set(GuidanceSurvyes.AuditC, this.auditC);
    this.surveys.set(GuidanceSurvyes.Phq9, this.phq9);
    this.surveys.set(GuidanceSurvyes.IpacAdap, this.ipacAdap);
    this.surveys.set(GuidanceSurvyes.Dds, this.dds);
    this.surveys.set(GuidanceSurvyes.Iris, this.iris);
    this.surveys.set(GuidanceSurvyes.Mna, this.mna);
    this.surveys.set(GuidanceSurvyes.Ocean, this.ocean);
    this.surveys.set(GuidanceSurvyes.Grit, this.grit);
    this.surveys.set(GuidanceSurvyes.Fagerstrom, this.fagerstrom);
    this.surveys.set(GuidanceSurvyes.WhoqolA, this.whoqol);
    this.surveys.set(GuidanceSurvyes.AssistOms, this.assist);
    this.surveys.set(GuidanceSurvyes.Katz, this.katz);
    this.surveys.set(GuidanceSurvyes.AlimentacaoMs, this.alimentacaoMs);
    this.surveys.set(GuidanceSurvyes.AsaA, this.asaA);
  }

  getLastCalculatedResponse(guidances: GuidanceDTO[]): GuidanceDTO {
    const answerDate = guidances.reduce((previous, guidance) => {
      return Math.max(previous, guidance.answerDate.getTime());
    }, 0);

    const result = guidances
      .filter((guidance) => {
        const result = guidance.answerDate.getTime() === answerDate;
        return result;
      })
      .shift();

    return result;
  }

  private selectSurvey(
    surveyId: number,
  ): BaseInterfaceSurvey<BaseSurveyAnswerDTO> {
    const survey = LimeSurveyIds[surveyId];
    return this.surveys.get(GuidanceSurvyes[survey]);
  }

  private async getGender(customerId: string): Promise<Gender> {
    const customer = await this.customerRepository.findOneById(customerId);
    return Gender[customer.gender];
  }

  private findGuidance(
    survey: BaseInterfaceSurvey<BaseSurveyAnswerDTO>,
    guidances: GuidanceEntity[],
  ): GuidanceEntity {
    const guidance = guidances.find((guidance) => {
      return guidance.behavior.integrationid === survey.integrationId;
    });
    return guidance;
  }

  async calculateResponses(): Promise<GuidanceDTO[]> {
    const [responses] = await this.limeSurveyResponseRepository.findAndCount({
      relations: ['customer'],
    });
    const updatedGuidances = [];
    for (const response of responses) {
      try {
        const survey = this.selectSurvey(response.surveyId);

        if (!survey) continue;

        const guidances = await this.guidanceRepostory.findAllByCustomerId(
          response.customer.customerid,
          {},
        );

        if (!guidances.items) continue;

        const guidance = this.findGuidance(survey, guidances.items);

        if (!guidance) continue;

        if (guidance.result) continue;
        const gender = await this.getGender(response.customer.customerid);

        const { result } = await survey.calculate({
          gender,
          answers: <any>response.responses,
        });

        const updatedGuidance = await this.guidanceService.saveResult({
          id: guidance.guidanceid,
          result: result.description,
          questionsxanswers: [response.questions].flat(),
          status: AppStatus.Answered,
        });

        updatedGuidances.push(updatedGuidance);
      } catch (error) {
        Logger.error(error, 'calculate-responses');
      }
    }
    return updatedGuidances;
  }
}
