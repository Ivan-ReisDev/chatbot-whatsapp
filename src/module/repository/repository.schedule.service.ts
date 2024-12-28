import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma';
import { Schedule } from 'src/entities/Schedule';

@Injectable()
export class RepositoryScheduleService {
  constructor(private readonly prisma: PrismaService) {}
  public async findUniqui(number: string): Promise<Schedule> {
    const schedule: Schedule = await this.prisma.schedule.findFirst({
      where: {
        number: number,
      },
      orderBy: { createdAt: 'desc' },
    });

    return schedule;
  }

  public async findAll(date: string): Promise<Schedule[]> {
    const schedule = await this.prisma.schedule.findMany({
      where: {
        date: new Date(date),
      },
    });

    console.log(schedule.length);
    return schedule.length > 0 ? schedule : [];
  }

  public async created(data: Schedule): Promise<Schedule> {
    console.log(data);
    const schedule: Schedule = await this.prisma.schedule.create({
      data: {
        number: data.number,
        name: data.name,
        date: new Date(data.date),
      },
    });

    return schedule;
  }
}
