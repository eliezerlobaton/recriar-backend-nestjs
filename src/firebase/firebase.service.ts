import { Injectable } from '@nestjs/common';
import { getDatabase, Database } from 'firebase-admin/database';
import { initializeFirebase } from 'src/config/firebase.config';
@Injectable()
export class FirebaseService {
  private db: Database;
  constructor() {
    initializeFirebase();
    this.db = getDatabase();
  }

  get dataBase(): Database {
    return this.db;
  }
}
