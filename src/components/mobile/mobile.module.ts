import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { configService } from 'src/config/config.service';
import { KnowledgeSubmissionModule } from '../knowledge-submission/knowledge-submission.module';
import { KnowledgeSubmissionService } from '../knowledge-submission/knowledge-submission.service';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';

const submissionService = {
  provide: 'KnowledgeSubmissionInterface',
  useClass: KnowledgeSubmissionService,
};

const mobileService = {
  provide: 'MobileServiceInterface',
  useClass: MobileService,
};

@Module({
  imports: [
    KnowledgeSubmissionModule,
    JwtModule.register({ secret: configService.getJwtSecret() }),
    HttpModule,
  ],
  controllers: [MobileController],
  providers: [submissionService, mobileService],
})
export class MobileModule {}
