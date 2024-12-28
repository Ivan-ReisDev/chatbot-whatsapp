import { Injectable } from '@nestjs/common';
import { InputJsonValue } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/database/prisma';
import { Msg } from 'src/entities/Msg';

@Injectable()
export class RepositoryService {
  constructor(private readonly prisma: PrismaService) {}

  public async findUniqui(number: string, state?: string): Promise<Msg> {
    const whereConditions: any = {
      number: number,
      status: 'active',
    };

    if (state) {
      whereConditions.state = state;
    }

    const msg = await this.prisma.messages.findFirst({
      where: whereConditions,
      orderBy: { createdAt: 'desc' },
    });

    return msg;
  }

  public async created(data: Msg) {
    await this.prisma.messages.create({
      data: {
        number: data.number,
        name: data.name,
        state_menu: data.state_menu,
        state: data.state,
        status: 'active',
        msg: data.msg,
        msgBot: data.msgBot as InputJsonValue[],
      },
    });
  }

  public async deleteHistory(number: string): Promise<void> {
    await this.prisma.messages.deleteMany({
      where: {
        number: number,
      },
    });
  }
}
