import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './module/whatsapp/whatsapp.module';
import { RepositoryModule } from './module/repository/repository.module';
import { MenuModule } from './module/menu/menu.module';
import { ScheduleModule } from './module/schedule/schedule.module';
import { ScheduleCreateModule } from './module/schedule.create/schedule.create.module';
import { RepositoryConfigService } from './module/repository/repository.config.service';
import { ConfigService } from './module/config/config.service';
import { ConfigModule } from './module/config/config.module';

@Module({
  imports: [
    WhatsappModule,
    RepositoryModule,
    MenuModule,
    ScheduleModule,
    ScheduleCreateModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, RepositoryConfigService, ConfigService],
})
export class AppModule {}
