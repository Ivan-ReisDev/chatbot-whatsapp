import { forwardRef, Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { ScheduleService } from './schedule.service';
import { MenuModule } from '../menu/menu.module';
import { ScheduleCreateModule } from '../schedule.create/schedule.create.module';

@Module({
  imports: [
    RepositoryModule,
    forwardRef(() => WhatsappModule),
    forwardRef(() => MenuModule),
    forwardRef(() => ScheduleCreateModule),
  ],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
