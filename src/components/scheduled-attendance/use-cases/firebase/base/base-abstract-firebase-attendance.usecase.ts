import { Injectable } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export abstract class BaseAbstractFirebaseAttendanceUseCase
  implements UseCase<boolean>
{
  protected readonly db: Database;
  protected readonly dbRef: Reference;
  constructor(protected readonly firebase: FirebaseService) {
    this.db = this.firebase.dataBase;
    this.db.goOnline();
    this.dbRef = this.db.ref('attendances');
  }
  abstract execute(...args: any[]): boolean | Promise<boolean>;
}
