import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { calendar_v3 } from 'googleapis';
import { CustomerEntity } from 'src/components/customer/entities/customer.entity';
import { CustomerRepositoryInterface } from 'src/components/customer/interfaces/customer.repository.interface';
import { SquadUserRole } from 'src/components/shared/dto/enums/common-enum';
import { SquadUserEntity } from 'src/components/shared/entities/squad-user.entity';
import { SquadUserRepositoryInterface } from 'src/components/shared/interfaces/squad-user.repository.interface';
import { TeamSquadRepositoryInterface } from 'src/components/teamsquad/interfaces/team-squad.repository.interface';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { ScheduledAttendanceDto } from '../dto/scheduled-attendance.dto';
import { ScheduledAttendanceEntity } from '../entities/scheduled-attendance.entity';
import { ScheduledAttendanceStatus } from '../enum/scheduled-attendance-status.enum';
import { ScheduledAttendanceRepositoryInterface } from '../interfaces/scheduled-attendance.repository.interface';
import { CreateVideoConferenceRoomUseCase } from './create-video-conference-room.usecase';
import { CreateFirebaseAttendanceUseCase } from './firebase/create-firebase-attendance.usecase';

@Injectable()
export class CreateScheduledAttendanceUseCase
  implements UseCase<ScheduledAttendanceDto | boolean>
{
  private readonly eventIds: string[] = [];
  private readonly eventType: Map<string, SquadUserRole> = new Map<
    string,
    SquadUserRole
  >();

  constructor(
    @Inject('ScheduledAttendanceRepositoryInterface')
    private readonly attendanceRepository: ScheduledAttendanceRepositoryInterface,
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
    @Inject('TeamSquadRepositoryInterface')
    private readonly teamSquadRepository: TeamSquadRepositoryInterface,
    @Inject('SquadUserRepositoryInterface')
    private readonly squadUserRepository: SquadUserRepositoryInterface,
    private readonly createRoom: CreateVideoConferenceRoomUseCase,
    private readonly createFirebase: CreateFirebaseAttendanceUseCase,
  ) {
    this.eventType.set('Enfermeira', SquadUserRole.Nurse);
    this.eventType.set(
      'Profissional de Educação Física',
      SquadUserRole.HealthCoach,
    );
    this.eventType.set('Nutrionista', SquadUserRole.Nutritionist);
    this.eventType.set('Médico', SquadUserRole.Medic);
    this.eventType.set('Psicóloga', SquadUserRole.Psychologist);
  }

  private async selectSquadUserByRole(
    customerId: string,
    role: SquadUserRole,
  ): Promise<SquadUserEntity> {
    const teamSquadMenbers = await Promise.all(
      (
        await this.teamSquadRepository.findByCondition({
          customerid: customerId,
        })
      )
        .map((menber) => menber.squaduserid)
        .map(async (id) => await this.squadUserRepository.findOneById(id)),
    );

    return teamSquadMenbers.find(
      (squadUser: SquadUserEntity) => squadUser.role === role,
    );
  }

  private async getCustomerByEmail(email: string): Promise<CustomerEntity> {
    return await this.customerRepository.findOneByCondition({ email: email });
  }

  private getRoleFromDescription(description: string): SquadUserRole | false {
    const eventType = description
      .split('\n')
      .find((text) =>
        text.match(/[a-zA-Z\s\u00C0-\u017F]*\|[a-zA-Z\s\u00C0-\u017F]*/gi),
      )
      .split(' | ')
      .pop();
    if (eventType) return this.eventType.get(eventType);
    return false;
  }

  private getReasonFromDescription(description: string): string {
    try {
      const reason = description
        .split('\n')
        .find((text) =>
          text.match(/motivos[a-zA-Z ]*:\s[a-zA-Z\u00C0-\u024F\s ]*/gi),
        )
        .split(':')
        .pop()
        .trim();
      return reason;
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  async execute(
    event: calendar_v3.Schema$Event,
  ): Promise<boolean | ScheduledAttendanceDto> {
    try {
      if (this.eventIds.includes(event.id)) return false;
      this.eventIds.push(event.id);
      const role = this.getRoleFromDescription(event.description);
      if (!role) return false;

      const email = event.attendees.find(
        (attendee) => !attendee.organizer,
      ).email;
      const customer = await this.getCustomerByEmail(email);
      if (!customer) return false;

      const squadUser = await this.selectSquadUserByRole(
        customer.customerid,
        role,
      );

      if (!squadUser) return false;

      const found = await this.attendanceRepository.findOneByCondition({
        event_id: event.id,
      });

      if (found) throw new ConflictException('Register already exists');

      const attendanceEntity = new ScheduledAttendanceEntity();
      attendanceEntity.event_id = event.id;
      attendanceEntity.customer = <any>customer.customerid;
      attendanceEntity.squaduser = <any>squadUser.squaduserid;
      attendanceEntity.event_uri = event.htmlLink;
      attendanceEntity.event_id = event.id;
      attendanceEntity.event_type = role;
      attendanceEntity.name = event.summary;
      attendanceEntity.start_date = new Date(event.start.dateTime);
      attendanceEntity.end_date = new Date(event.end.dateTime);
      attendanceEntity.status = ScheduledAttendanceStatus.Active;
      attendanceEntity.reason = this.getReasonFromDescription(
        event.description,
      );

      const attendanceCreated = await this.attendanceRepository.create(
        attendanceEntity,
      );

      const attendance =
        await this.attendanceRepository.findOneByIdWithRelations(
          attendanceCreated.scheduled_attendanceid,
        );

      this.createRoom.execute(attendance.scheduled_attendanceid);

      setTimeout(() => console.log(this.eventIds.shift()), 30000);
      await this.createFirebase.execute(
        attendance.squaduser.squaduserid,
        attendance.scheduled_attendanceid,
      );
      return ScheduledAttendanceDto.fromEntity(attendance);
    } catch (error) {
      Logger.error(error, 'CreateScheduledAttendance');
      console.log(error);
      return false;
    }
  }
}
