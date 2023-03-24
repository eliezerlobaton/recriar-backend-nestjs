import { Injectable, Logger } from '@nestjs/common';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { FirebaseAttendanceDto } from '../../dto/firebase-attendance.dto';
import { ScheduledAttendanceStatus } from '../../enum/scheduled-attendance-status.enum';
import { BaseAbstractFirebaseAttendanceUseCase } from './base/base-abstract-firebase-attendance.usecase';

@Injectable()
export class CreateFirebaseAttendanceUseCase
  extends BaseAbstractFirebaseAttendanceUseCase
  implements UseCase<boolean>
{
  async execute(
    squadUserId: string,
    scheduledAttendanceId: string,
  ): Promise<boolean> {
    const register: FirebaseAttendanceDto = {
      hasParticipants: false,
      isRoomReady: false,
      status: ScheduledAttendanceStatus.Active,
    };
    try {
      await this.dbRef
        .child(`${squadUserId}/${scheduledAttendanceId}`)
        .set(register);
      return true;
    } catch (error) {
      Logger.error(error, 'CreateFirebaseAttendance');
      console.log(error);
      return false;
    }
  }
}
