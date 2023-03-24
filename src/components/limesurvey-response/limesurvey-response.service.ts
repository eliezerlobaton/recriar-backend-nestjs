import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CustomerRepositoryInterface } from '../customer/interfaces/customer.repository.interface';
import { LimesurveyApiServiceInterface } from '../shared/interfaces/limesurveyapi.service.interface';
import { fixCPFLength, isIntegrationId } from '../shared/lib/common-functions';
import { IntegrateResponseDTO } from './dto/integrate-response.dto';
import { LimesurveyResponseDTO } from './dto/limesurvey-response.dto';
import { LimesurveyResponseRepositoryInterface } from './interfaces/limesurvey-response.repository.interface';
import { LimesurveyResponseServiceInterface } from './interfaces/limesurvey-response.service.interface';

@Injectable()
export class LimesurveyResponseService
  implements LimesurveyResponseServiceInterface
{
  constructor(
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
    @Inject('LimesurveyResponseRepositoryInterface')
    private readonly limesurveyResponseRepository: LimesurveyResponseRepositoryInterface,
    @Inject('LimesurveyApiServiceInterface')
    private readonly limesurveyApi: LimesurveyApiServiceInterface,
  ) {}

  async getAllSurveyResponses(surveyId: number) {
    const customerIdByCPF = {};
    const shortFormatResult = await this.limesurveyApi.getSurveyResponses(
      surveyId,
      'code',
      'short',
    );

    const longFormatResult = await this.limesurveyApi.getSurveyResponses(
      surveyId,
      'full',
      'long',
    );

    const integrationPromises = shortFormatResult.map(
      async (rawAnswer): Promise<LimesurveyResponseDTO> => {
        const shortFormatKeys = Object.keys(rawAnswer);
        const keyIndex = {
          id: shortFormatKeys.indexOf('id'),
          cpf: shortFormatKeys.indexOf('CPF'),
          submitDate: shortFormatKeys.indexOf('submitdate'),
          lastPage: shortFormatKeys.indexOf('lastpage'),
          startLanguage: shortFormatKeys.indexOf('startlanguage'),
          seed: shortFormatKeys.indexOf('seed'),
        };
        const shortResponsesKeys = shortFormatKeys.filter((key) =>
          isIntegrationId(key),
        );

        const responsesIndexes = shortResponsesKeys.map((key) =>
          shortFormatKeys.indexOf(key),
        );

        const cleanCPF = rawAnswer[shortFormatKeys[keyIndex.cpf]]
          ? fixCPFLength(rawAnswer[shortFormatKeys[keyIndex.cpf]])
          : '';

        if (!customerIdByCPF?.[cleanCPF]) {
          const customers = await this.customerRepository.findByCondition({
            cpf: cleanCPF,
          });

          if (customers.length > 1)
            throw new ConflictException(
              `CPF ${cleanCPF} has more than one owner`,
            );

          const customer = customers.shift();
          if (!customer) {
            return null;
          }
          customerIdByCPF[cleanCPF] = customer?.customerid;
        }

        const responses = shortResponsesKeys.map((responseKey) => ({
          question: responseKey,
          answer: rawAnswer[responseKey],
        }));

        const currentLongAnswer = longFormatResult.find((response) => {
          const keys = Object.keys(response);
          return (
            response[keys[keyIndex.id]] ===
            rawAnswer[shortFormatKeys[keyIndex.id]]
          );
        });

        const longKeys = Object.keys(currentLongAnswer);
        const longAnswerKeys = longKeys.filter((key, index) =>
          responsesIndexes.includes(index),
        );
        const questions = longAnswerKeys.map((questionKey) => ({
          question: questionKey,
          answer: currentLongAnswer[questionKey],
        }));

        const newLimesurveyResponse = new LimesurveyResponseDTO();
        newLimesurveyResponse.surveyId = surveyId;
        newLimesurveyResponse.responseId =
          rawAnswer[shortFormatKeys[keyIndex.id]].trim();
        newLimesurveyResponse.customer = customerIdByCPF[cleanCPF];
        newLimesurveyResponse.responses = responses;
        newLimesurveyResponse.questions = questions;
        newLimesurveyResponse.submitDate = new Date(
          rawAnswer[shortFormatKeys[keyIndex.submitDate]],
        );
        newLimesurveyResponse.lastPage = parseInt(
          rawAnswer[shortFormatKeys[keyIndex.lastPage]],
        );
        newLimesurveyResponse.startLanguage =
          rawAnswer[shortFormatKeys[keyIndex.startLanguage]];
        newLimesurveyResponse.seed = parseInt(
          rawAnswer[shortFormatKeys[keyIndex.seed]],
        );
        return newLimesurveyResponse;
      },
    );
    return await Promise.all(integrationPromises).then((responses) =>
      responses.filter((r) => r !== null),
    );
  }

  async integrateResponses(surveyId: number): Promise<IntegrateResponseDTO> {
    const responses = await this.getAllSurveyResponses(surveyId);
    let newResponseCounter = 0;
    const responsePromises = responses.map(async (response) => {
      const found = await this.limesurveyResponseRepository.findOneByCondition({
        customer: response.customer,
        surveyId: response.surveyId,
        responseId: response.responseId,
      });

      if (typeof found === 'undefined' || !found) {
        newResponseCounter++;
        return this.limesurveyResponseRepository.create(response);
      }
      return;
    });
    await Promise.all(responsePromises);
    return {
      surveyId: surveyId,
      responsesFounded: responses.length,
      newResponsesIntegrated: newResponseCounter,
    };
  }
}
