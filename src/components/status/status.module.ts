import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { StatusController } from './status.controller';

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig())],
  providers: [],
  exports: [],
  controllers: [StatusController],
})
export class StatusModule {}
