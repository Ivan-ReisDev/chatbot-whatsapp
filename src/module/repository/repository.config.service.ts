import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma';
import { Config, IOperatingHour } from 'src/entities/Config';

@Injectable()
export class RepositoryConfigService {
  constructor(private readonly prisma: PrismaService) {}

  public async findUniqui(): Promise<Config> {
    const config = await this.prisma.config.findFirst({});

    if (!config) {
      throw new NotFoundException('Não existe nenhuma configuração');
    }

    const operatingHours: IOperatingHour[] = config.operatingHours.map(
      (hour: any) => ({
        dayOfWeek: hour.dayOfWeek,
        openingTime: hour.openingTime,
        closingTime: hour.closingTime,
      }),
    );

    return {
      ...config,
      operatingHours,
    };
  }

  public async created(data: Config) {
    const create = await this.prisma.config.create({
      data: {
        operatingHours: JSON.parse(JSON.stringify(data.operatingHours)) as any,
      },
    });

    if (!create) {
      throw new HttpException(
        'Erro ao criar configuração',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
