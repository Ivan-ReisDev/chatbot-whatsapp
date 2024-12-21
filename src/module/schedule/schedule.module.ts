import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { RepositoryService } from '../repository/repository.service';

@Module({
  providers: [ScheduleService],
  exports: [ScheduleService], // Exportando para ser usado em outros módulos, como o WhatsappService
})
export class ScheduleModule {}
