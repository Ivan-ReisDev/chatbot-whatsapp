import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WhatsappService } from './whatsapp.service';
import { RepositoryService } from '../repository/repository.service';
import { RepositoryModule } from '../repository/repository.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { ScheduleService } from '../schedule/schedule.service';

@Module({
  imports: [EventEmitterModule.forRoot(), RepositoryModule, ScheduleModule],
  providers: [WhatsappService, RepositoryService, ScheduleService],
})
export class WhatsappModule {}
