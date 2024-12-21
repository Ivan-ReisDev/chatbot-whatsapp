import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma';
import { Msg } from 'src/entities/Msg';

@Injectable()
export class RepositoryService {
  constructor(private readonly prisma: PrismaService) {}

  public async findUniqui(number: string): Promise<Msg> {
    const msg = await this.prisma.messages.findFirst({
      where: { number: number, status: 'active' },
      orderBy: { createdAt: 'desc' },
    });

    if (msg) {
      return new Msg(msg);
    }
  }

  public async created(data: Msg) {
    const msg = await this.prisma.messages.create({
      data: {
        number: data.number,
        name: data.name || '',
        state: data.state,
        status: 'active',
        msg: data.msg,
      },
    });
  }
}
