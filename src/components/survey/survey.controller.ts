import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LimesurveyResponseEntity } from '../shared/entities/limesurvey-response.entity';
import { LimeSurveyResponseRepositoryInterface } from '../shared/interfaces/lime-survey-reponse.repository.interface';
import { AuditCSurvey } from './surveys/audit-c.survey';
import { BaseSurveyAnswerDTO } from './surveys/base/dto/base.survey.answer.dto';
import { DdsSurvey } from './surveys/dds.survey';
import { SurveyEntity } from './entities/survey.entity';
import { GritSurvey } from './surveys/grit.survey';
import { SimpleSurveyAnswerDTO } from './surveys/base/dto/simple.survey.answer.dto';
import { FagerstromSurvey } from './surveys/fagerstrom.survey';
import { SurveyRepositoryInterface } from './interfaces/survey.repository.interface';
import { IpacAdapSurvey } from './surveys/ipac-adap.survey';
import { IrisSruvey } from './surveys/iris.survey';
import { Phq9Survey } from './surveys/phq-9.survey';
import { SurveyService } from './survey.service';
import { MnaSurvey } from './surveys/mna.survey';
import { OceanSurvey } from './surveys/ocean.survey';
import { WhoqolASurvey } from './surveys/whoqol-a.survey';
import { AssistOmsSurvey } from './surveys/assist-oms.survey';
import { KatzSruvey } from './surveys/katz.survey';
import { AlimentacaoMsSurvey } from './surveys/alimentacao-ms.survey';
import { BaseAbstractSurvey } from './surveys/base/base.abstract.survey';
import { AsaASurvey } from './surveys/asa-a.survey';

@ApiTags('Survey')
@Controller('survey')
export class SurveyController {
  constructor(
    @Inject('SurveyRepositoryInterface')
    private readonly formRepository: SurveyRepositoryInterface,
    @Inject('LimeSurveyResponseRepositoryInterface')
    private readonly limeSurveyResponseRepository: LimeSurveyResponseRepositoryInterface,
    private readonly surveyService: SurveyService,
    private readonly auditc: AuditCSurvey,
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
    private readonly alimentacaoms: AlimentacaoMsSurvey,
    private readonly asaa: AsaASurvey,
  ) {}

  @Post()
  async create(@Body() form: Partial<SurveyEntity>) {
    return this.formRepository.create(form);
  }

  @Put()
  async update(@Body() form: SurveyEntity) {
    return this.formRepository.updateOne(form);
  }

  @Get()
  async findAll() {
    return this.formRepository.findAll();
  }

  @Post('/limesurvey-response')
  async createResponse(@Body() limeSurveyReponse: LimesurveyResponseEntity) {
    return this.limeSurveyResponseRepository.create(limeSurveyReponse);
  }

  @Get('/calculate')
  async calculate() {
    return this.surveyService.calculateResponses();
  }

  @Post('/calculate/:survey')
  async calculateSurvey(
    @Param('survey') survey: string,
    @Body() answers: BaseSurveyAnswerDTO | SimpleSurveyAnswerDTO,
  ) {
    if (!Object.keys(this).includes(survey))
      throw new NotFoundException(`Survey ${survey} not found`);

    return (<BaseAbstractSurvey>this[survey]).calculate(<any>answers);
  }
}
