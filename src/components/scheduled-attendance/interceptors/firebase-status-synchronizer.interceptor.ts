import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FirebaseAttendanceDto } from '../dto/firebase-attendance.dto';
import { ScheduledAttendanceDto } from '../dto/scheduled-attendance.dto';
import { ScheduledAttendancesByDateDto } from '../dto/scheduled-attendances-by-date.dto';
import { ScheduledAttendanceStatus } from '../enum/scheduled-attendance-status.enum';

@Injectable()
export class FirebaseStatusSynchronizerInterceptor implements NestInterceptor {
  constructor(private readonly firebase: FirebaseService) {}

  async getFirebaseInfo(
    attendance: ScheduledAttendanceDto,
  ): Promise<ScheduledAttendanceDto> {
    const data: FirebaseAttendanceDto = (
      await this.firebase.dataBase
        .ref(`attendances`)
        .child(`${attendance.squadUser.id}/${attendance.id}`)
        .get()
    ).val();

    attendance.status = data?.status
      ? data.status
      : ScheduledAttendanceStatus.Realized;
    attendance.isRoomReady = data?.isRoomReady ? data.isRoomReady : false;
    attendance.hasParticipants = data?.hasParticipants
      ? data.hasParticipants
      : false;

    return attendance;
  }

  async transformGroupByDate(
    data: GetBaseResponseDTO<ScheduledAttendancesByDateDto[]>,
  ): Promise<GetBaseResponseDTO<ScheduledAttendancesByDateDto[]>> {
    data.items = await Promise.all(
      data.items.map(async (item) => {
        item.attendances = await Promise.all(
          item.attendances.map((attendance) =>
            this.getFirebaseInfo(attendance),
          ),
        );
        return item;
      }),
    );
    return data;
  }

  async transformItems(
    data: GetBaseResponseDTO<ScheduledAttendanceDto[]>,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceDto[]>> {
    data.items = await Promise.all(
      data.items.map(async (item) => {
        return await this.getFirebaseInfo(item);
      }),
    );
    return data;
  }

  async transform(
    data: ScheduledAttendanceDto[],
  ): Promise<ScheduledAttendanceDto[]> {
    return await Promise.all(
      data.map(async (item) => {
        return await this.getFirebaseInfo(item);
      }),
    );
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map(async (data) => {
        if (request.url.includes('services'))
          return await this.transformItems(data);
        if (!data?.items) {
          return await this.getFirebaseInfo(data);
        }
        if (
          !request.url.includes('customer') &&
          !request.url.includes('squaduser')
        )
          return this.transformGroupByDate(data);
        return this.transformItems(data);
      }),
    );
  }
}
