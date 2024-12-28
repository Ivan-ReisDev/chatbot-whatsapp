import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { RepositoryScheduleService } from './repository.schedule.service';
import { RepositoryConfigService } from './repository.config.service';
import { PrismaService } from 'src/database/prisma';

@Module({
  providers: [
    RepositoryService,
    PrismaService,
    RepositoryScheduleService,
    RepositoryConfigService,
  ],
  exports: [
    RepositoryService,
    PrismaService,
    RepositoryScheduleService,
    RepositoryConfigService,
  ],
})
export class RepositoryModule {}
