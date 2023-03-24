import { Inject, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { LessThanOrEqual } from 'typeorm';
import { ScheduledAttendanceEntity } from '../entities/scheduled-attendance.entity';
import { ScheduledAttendanceStatus } from '../enum/scheduled-attendance-status.enum';
import { ScheduledAttendanceRepositoryInterface } from '../interfaces/scheduled-attendance.repository.interface';
import { BaseAbstractFirebaseAttendanceUseCase } from './firebase/base/base-abstract-firebase-attendance.usecase';

@Injectable()
export class UpdateAttendancesStatusUseCase
  extends BaseAbstractFirebaseAttendanceUseCase
  implements UseCase<boolean>
{
  constructor(
    @Inject('ScheduledAttendanceRepositoryInterface')
    private readonly attendanceRepository: ScheduledAttendanceRepositoryInterface,
    private readonly firebaseService: FirebaseService,
  ) {
    super(firebaseService);
  }

  private async getPastAttendances(): Promise<ScheduledAttendanceEntity[]> {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 15);
    const attendances = await this.attendanceRepository.findByCondition({
      end_date: LessThanOrEqual(date),
    });
    return await Promise.all(
      attendances.map(
        async (attendance) =>
          await this.attendanceRepository.findOneByIdWithRelations(
            attendance.scheduled_attendanceid,
          ),
      ),
    );
  }

  async execute(): Promise<boolean> {
    const attendances = await this.getPastAttendances();

    const updatedAttendances = attendances
      .filter((attendance) => attendance !== undefined)
      .map(async (attendace) => {
        attendace.status = ScheduledAttendanceStatus.Realized;
        await this.dbRef
          .child(
            `${attendace.squaduser.squaduserid}/${attendace.scheduled_attendanceid}/status`,
          )
          .set(ScheduledAttendanceStatus.Realized);
        return await this.attendanceRepository.updateOne(attendace);
      });
    await Promise.all(updatedAttendances);
    return true;
  }
}
