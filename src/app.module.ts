import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './module/whatsapp/whatsapp.module';
import { RepositoryModule } from './module/repository/repository.module';
import { ScheduleModule } from './module/schedule/schedule.module';

@Module({
  imports: [WhatsappModule, RepositoryModule, ScheduleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
