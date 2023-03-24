import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AssistantRequestModule } from './components/assistant-request/assistant-request.module';
import { BehaviorModule } from './components/behavior/behavior.module';
import { ContentSubmissionModule } from './components/content-submission/content-submission.module';
import { ContentModule } from './components/content/content.module';
import { CustomerModule } from './components/customer/customer.module';
import { GuidanceModule } from './components/guidance/guidance.module';
import { IllnessModule } from './components/illness/illness.module';
import { IntegrationSchedulerModule } from './components/integration-scheduler/integration-scheduler.module';
import { KnowledgeObjectiveModule } from './components/knowledge-objective/knowledge-objective.module';
import { KnowledgeSubmissionModule } from './components/knowledge-submission/knowledge-submission.module';
import { KnowledgeModule } from './components/knowledge/knowledge.module';
import { LimesurveyResponsesModule } from './components/limesurvey-response/limesurvey-responses.module';
import { MailchimpApiModule } from './components/mailchimp-api/mailchimp-api.module';
import { MobileModule } from './components/mobile/mobile.module';
import { PanelModule } from './components/panel/panel.module';
import { ScheduledAttendanceModule } from './components/scheduled-attendance/scheduled-attendance.module';
import { LoggerRouteMiddleware } from './components/shared/middlewares/logger-route.middleware';
import { QueryParameterMiddleware } from './components/shared/middlewares/query-parameter.middleware';
import { StatusModule } from './components/status/status.module';
import { SurveyModule } from './components/survey/survey.module';
import { VideoConferenceModule } from './components/video-conference/video-conference.module';
import { DatabaseModule } from './database/database.module';
import { FilesService } from './files/files.service';
import { FirebaseModule } from './firebase/firebase.module';
import { ServicesModule } from './components/services/services.module';
import { RemindersModule } from './components/reminder/reminder.module';
import { TeamsquadModule } from './components/teamsquad/teamsquad.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    ContentModule,
    ContentSubmissionModule,
    CustomerModule,
    KnowledgeModule,
    KnowledgeSubmissionModule,
    KnowledgeObjectiveModule,
    StatusModule,
    MobileModule,
    BehaviorModule,
    SurveyModule,
    GuidanceModule,
    LimesurveyResponsesModule,
    MailchimpApiModule,
    PanelModule,
    AssistantRequestModule,
    IntegrationSchedulerModule,
    VideoConferenceModule,
    ScheduledAttendanceModule,
    IllnessModule,
    FirebaseModule,
    ServicesModule,
    RemindersModule,
    TeamsquadModule,
  ],
  controllers: [],
  providers: [FilesService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(QueryParameterMiddleware).forRoutes('*');
    consumer.apply(LoggerRouteMiddleware).forRoutes('*');
  }
}
