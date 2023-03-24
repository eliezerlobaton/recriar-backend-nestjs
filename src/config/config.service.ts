import 'dotenv/config';

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  /**
   * getLokiUrl
   */
  public getLokiUrl() {
    return this.getValue('LOKI', true);
  }

  /**
   * getGuidanceBucketName
   */
  public getGuidanceBucketName() {
    return this.getValue('GUIDANCE_AWS_BUCKET_NAME', true);
  }

  public getLimesurveyUrl() {
    return this.getValue('LIMESURVEY_API', true);
  }

  public getLimesurveyUser() {
    return this.getValue('LIMESURVEY_USER', true);
  }

  public getLimesurveyPassword() {
    return this.getValue('LIMESURVEY_PASSWORD', true);
  }

  public getJwtSecret() {
    return this.getValue('JWT_SECRET', true);
  }

  public getPort() {
    return parseInt(this.getValue('NESTJS_PORT', true));
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getCommitHash() {
    return this.getValue('Mihmo__Version', true);
  }

  public getTypeOrmConfig(): any {
    return {
      type: 'postgres',

      host: this.getValue('DATABASE_HOST'),
      port: parseInt(this.getValue('DATABASE_PORT')),
      username: this.getValue('DATABASE_USER'),
      password: this.getValue('DATABASE_PASSWORD'),
      database: this.getValue('DATABASE_NAME'),

      entities: [
        'components/**/entities/*.entity{.ts,.js}',
        'dist/components/**/entities/*.entity{.ts,.js}',
      ],

      migrationsTableName: 'migration',

      migrations: ['migration/*{.ts,.js}'],
      synchronize: false,
      migrationsRun: JSON.parse(this.getValue('RUN_MIGRATIONS')),

      cli: {
        migrationsDir: 'migration',
      },

      ssl: this.isProduction(),
    };
  }

  public getMailchimpServerPrefix() {
    return this.getValue('MAILCHIMP_PREFIX', true);
  }

  public getMailchimpApiKey() {
    return this.getValue('MAILCHIMP_API_KEY', true);
  }

  public getMailchimpAudienceId() {
    return this.getValue('MAILCHIMP_AUDIENCE_ID', true);
  }

  public getStaticFoldersPath() {
    return this.getValue('STATIC_FOLDERS_PATH', true);
  }

  public getTwilioAccountSid() {
    return this.getValue('TWILIO_ACCOUNT_SID', true);
  }

  public getTwilioApiKey() {
    return this.getValue('TWILIO_API_KEY', true);
  }

  public getTwilioApiSecret() {
    return this.getValue('TWILIO_API_SECRET', true);
  }

  public getTwilioStatusCallbackUrl() {
    return this.getValue('TWILIO_STATUS_CALLBACK_URL', true);
  }

  public getTwilioStatusCallbackMethod() {
    return this.getValue('TWILIO_STATUS_CALLBACK_METHOD', true);
  }

  public google = {
    calendar: {
      /**
       * getGoogleCalendarId
       */
      getId: () => {
        return this.getValue('GOOGLE_CALENDAR_ID', true);
      },

      /**
       * getGoogleCalendarWatcherToken
       */
      getWatcherToken: () => {
        return this.getValue('GOOGLE_CALENDAR_WATCHER_TOKEN', true);
      },
    },
    /**
     * getGoogleServiceAccountCredentials
     */
    getServiceAccountCredentials: (): {
      client_email: string;
      private_key: string;
    } => {
      const client_email = this.getValue('GOOGLE_CLIENT_EMAIL', true);
      const private_key = this.getValue('GOOGLE_PRIVATE_KEY', true);

      return { client_email, private_key };
    },

    firebase: {
      getCredentials: () => {
        return this.getValue('GOOGLE_FIREBASE_SERVICE_CREADENTIALS', true);
      },
      getDatabaseUrl: () => {
        return this.getValue('GOOGLE_FIREBASE_DATABASE_URL', true);
      },
      getConfig: () => {
        return this.getValue('GOOGLE_FIREBASE_CONFIG', true);
      },
    },
  };
  public calendly = {
    getUrl: () => this.getValue('CALENDLY_URL', true),
  };
}

const configService = new ConfigService(process.env).ensureValues([
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
]);

export { configService };
