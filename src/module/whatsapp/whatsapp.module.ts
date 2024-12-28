import { forwardRef, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WhatsappService } from './whatsapp.service';
import { RepositoryModule } from '../repository/repository.module';
import { MenuModule } from '../menu/menu.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { ScheduleCreateModule } from '../schedule.create/schedule.create.module'; // Corrigido para o módulo

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RepositoryModule,
    forwardRef(() => MenuModule),
    forwardRef(() => ScheduleModule),
    forwardRef(() => ScheduleCreateModule),
  ],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
