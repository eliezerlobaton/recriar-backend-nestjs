import { Controller, Get } from '@nestjs/common';
import { configService } from 'src/config/config.service';

@Controller('status')
export class StatusController {
  @Get()
  async getGithubCommitSha() {
    return configService.getCommitHash();
  }
}
