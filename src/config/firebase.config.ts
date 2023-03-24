import * as firebase from 'firebase-admin';
import { configService } from './config.service';

export function initializeFirebase() {
  const serviceAccount = JSON.parse(
    configService.google.firebase.getCredentials().replace(/\'/g, '"'),
  );
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: configService.google.firebase.getDatabaseUrl(),
  });
}
