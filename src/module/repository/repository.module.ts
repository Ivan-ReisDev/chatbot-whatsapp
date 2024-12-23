import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { PrismaService } from 'src/database/prisma';
import { RepositoryScheduleService } from './repository.schedule.service';

@Module({
  providers: [RepositoryService, PrismaService, RepositoryScheduleService],
  exports: [RepositoryService, PrismaService, RepositoryScheduleService],
})
export class RepositoryModule {}
