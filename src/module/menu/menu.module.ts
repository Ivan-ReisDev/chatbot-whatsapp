import { forwardRef, Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { RepositoryModule } from '../repository/repository.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { ScheduleCreateModule } from '../schedule.create/schedule.create.module';

@Module({
  imports: [
    RepositoryModule,
    forwardRef(() => WhatsappModule),
    forwardRef(() => ScheduleModule),
    forwardRef(() => ScheduleCreateModule),
  ],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
