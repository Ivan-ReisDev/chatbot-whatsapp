import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma';
import { Schedule } from 'src/entities/Schedule';

@Injectable()
export class RepositoryScheduleService {
  constructor(private readonly prisma: PrismaService) {}
  public async findUniqui(cpf: string): Promise<Schedule> {
    const schedule: Schedule = await this.prisma.schedule.findFirst({
      where: {
        cpf: cpf,
      },
      orderBy: { createdAt: 'desc' },
    });

    return schedule;
  }
}
