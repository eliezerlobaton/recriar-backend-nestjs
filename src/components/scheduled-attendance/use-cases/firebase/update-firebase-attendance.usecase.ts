import { Injectable, Logger } from '@nestjs/common';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { BaseAbstractFirebaseAttendanceUseCase } from './base/base-abstract-firebase-attendance.usecase';

@Injectable()
export class UpdateFirebaseAttendanceUseCase
  extends BaseAbstractFirebaseAttendanceUseCase
  implements UseCase<boolean>
{
  async execute(
    squadUserId: string,
    scheduledAttendanceId: string,
    property: string,
    value: any,
  ): Promise<boolean> {
    try {
      await this.dbRef
        .child(`${squadUserId}/${scheduledAttendanceId}/${property}`)
        .set(value);
      return true;
    } catch (error) {
      Logger.error(error, 'UpdateFirebaseAttendance');
      console.log(error);
      return false;
    }
  }
}
