import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { configService } from 'src/config/config.service';

Injectable();
export class AuthenticateGoogleApi {
  async run() {
    const secrets = configService.google.getServiceAccountCredentials();
    secrets.private_key = secrets.private_key.replace(/\\n/g, '\n');
    const jwt = new google.auth.JWT(
      secrets.client_email,
      null,
      secrets.private_key,
      ['https://www.googleapis.com/auth/calendar'],
    );
    await jwt.authorize();
    return jwt;
  }
}
