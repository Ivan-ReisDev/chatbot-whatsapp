import { forwardRef, Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { RepositoryModule } from '../repository/repository.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { ScheduleService } from '../schedule/schedule.service';

@Module({
  imports: [RepositoryModule, forwardRef(() => WhatsappModule)],
  providers: [MenuService, ScheduleService],
  exports: [MenuService],
})
export class MenuModule {}
