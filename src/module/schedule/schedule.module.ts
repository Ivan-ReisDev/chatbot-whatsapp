import { forwardRef, Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [RepositoryModule, forwardRef(() => WhatsappModule)],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
