import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderRepository } from 'src/repositories/reminder.repository';
import { ReminderEntity } from './entities/reminder.entity';
import { ReminderController } from './reminder.controller';
import { CreateReminderUseCase } from './use-cases/create-reminder.usecase';
import { DeleteReminderUseCase } from './use-cases/delete-reminder.usecase';
import { GetAllRemindersUseCase } from './use-cases/get-all-reminders.usecase';
import { GetOneReminderUseCase } from './use-cases/get-one-reminder.usecase';
import { UpdateReminderUseCase } from './use-cases/update-reminder.usecase';

const reminderRepository = {
  provide: 'ReminderRepositoryInterface',
  useClass: ReminderRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([ReminderEntity])],
  controllers: [ReminderController],
  providers: [
    reminderRepository,
    CreateReminderUseCase,
    GetAllRemindersUseCase,
    GetOneReminderUseCase,
    UpdateReminderUseCase,
    DeleteReminderUseCase,
  ],
})
export class RemindersModule {}
