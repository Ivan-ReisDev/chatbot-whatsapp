import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { RepositoryConfigService } from '../repository/repository.config.service';
import { ConfigService } from './config.service';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [ConfigController],
  providers: [ConfigService, RepositoryConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
