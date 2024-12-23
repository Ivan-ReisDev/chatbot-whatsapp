import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './module/whatsapp/whatsapp.module';
import { RepositoryModule } from './module/repository/repository.module';
import { MenuModule } from './module/menu/menu.module';
import { ScheduleModule } from './module/schedule/schedule.module';

@Module({
  imports: [WhatsappModule, RepositoryModule, MenuModule, ScheduleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
