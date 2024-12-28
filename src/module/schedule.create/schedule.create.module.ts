import { forwardRef, Module } from '@nestjs/common';
import { ScheduleCreateService } from './schedule.create.service';
import { RepositoryModule } from '../repository/repository.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { MenuModule } from '../menu/menu.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { ConfigService } from '../config/config.service';
import { RepositoryScheduleService } from '../repository/repository.schedule.service';

@Module({
  imports: [
    RepositoryModule,
    forwardRef(() => WhatsappModule),
    forwardRef(() => MenuModule),
    forwardRef(() => ScheduleModule),
  ],
  providers: [ScheduleCreateService, ConfigService, RepositoryScheduleService],
  exports: [ScheduleCreateService],
})
export class ScheduleCreateModule {}
