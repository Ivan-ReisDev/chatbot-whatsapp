import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { PrismaService } from 'src/database/prisma';

@Module({
  providers: [RepositoryService, PrismaService],
  exports: [RepositoryService, PrismaService],
})
export class RepositoryModule {}
