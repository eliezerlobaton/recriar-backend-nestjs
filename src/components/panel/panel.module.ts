import { Module } from '@nestjs/common';
import { PanelService } from './panel.service';
import { PanelController } from './panel.controller';
import { DatabaseModule } from 'src/database/database.module';
import { GetAllCustomerResponsibleUseCase } from './use-cases/get-all-customer-responsible.usecase';

const panelService = {
  provide: 'PanelServiceInterface',
  useClass: PanelService,
};

@Module({
  imports: [DatabaseModule],
  controllers: [PanelController],
  providers: [panelService, GetAllCustomerResponsibleUseCase],
})
export class PanelModule {}
