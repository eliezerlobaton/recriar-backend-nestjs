import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../config/config.service';
import { DatabaseService } from './database.service';

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig())],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
