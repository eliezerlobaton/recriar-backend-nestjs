import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { NoteRepository } from 'src/repositories/note.repository';
import { CreateNoteUseCase } from './use-cases/create-note.usecase';
import { GetAllNotesUseCase } from './use-cases/get-all-notes.usecase';
import { GetOneNoteUseCase } from './use-cases/get-one-note.usecase';
import { UpdateOneNoteUseCase } from './use-cases/update-one-note.usecase';
import { DeleteOneNoteUseCase } from './use-cases/delete-one-note.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from './entities/note.entity';
import { ScheduledAttendanceModule } from '../scheduled-attendance/scheduled-attendance.module';
import { ScheduledAttendanceEntity } from '../scheduled-attendance/entities/scheduled-attendance.entity';
import { GetAllAttendancesUseCase } from './use-cases/get-all-attendances.usecase';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AssistantRequestModule } from '../assistant-request/assistant-request.module';
import { GetAllForwardingsUseCase } from './use-cases/get-all-forwardings.usecase';

const noteRepository = {
  provide: 'NoteRepositoryInterface',
  useClass: NoteRepository,
};

@Module({
  imports: [
    ScheduledAttendanceModule,
    FirebaseModule,
    AssistantRequestModule,
    TypeOrmModule.forFeature([NoteEntity, ScheduledAttendanceEntity]),
  ],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    noteRepository,
    CreateNoteUseCase,
    GetAllNotesUseCase,
    GetOneNoteUseCase,
    UpdateOneNoteUseCase,
    DeleteOneNoteUseCase,
    GetAllAttendancesUseCase,
    GetAllForwardingsUseCase,
  ],
})
export class ServicesModule {}
