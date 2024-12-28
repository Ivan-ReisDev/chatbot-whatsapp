import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { Msg } from 'src/entities/Msg';
import { RepositoryScheduleService } from '../repository/repository.schedule.service';
import { Schedule } from 'src/entities/Schedule';
import { MenuService } from '../menu/menu.service';
import { ScheduleCreateService } from '../schedule.create/schedule.create.service';

@Injectable()
export class ScheduleService {
  constructor(
    private repositorye: RepositoryService,
    private repositoryScheduleService: RepositoryScheduleService,
    @Inject(forwardRef(() => MenuService))
    private menuService: MenuService,
    @Inject(forwardRef(() => WhatsappService))
    public whatsappService: WhatsappService,
    @Inject(forwardRef(() => ScheduleCreateService))
    public scheduleCreateService: ScheduleCreateService,
  ) {}

  public async execute(message: any) {
    const number = message.from.split('@')[0];
    const msgDB: Msg = await this.repositorye.findUniqui(number);

    const schedules = await this.repositoryScheduleService.findUniqui(number);

    if (schedules) {
      const newSchedule = new Schedule(schedules);
      await this.whatsappService.client.sendMessage(
        message.from,
        `📅 *Informações do Agendamento*\n` +
          `📞 *Número:* ${newSchedule.number}\n` +
          `👤 *Nome:* ${newSchedule.name}\n` +
          `⏰ *Horário:* ${newSchedule.date}\n` +
          `📌 *Status:* ${newSchedule.status}\n` +
          `📆 *Data:* ${new Date(newSchedule.date).toLocaleDateString()}\n`,
      );
    } else {
      await this.whatsappService.client.sendMessage(
        message.from,
        `Não encontramos nenhum agendamento.`,
      );
    }

    await this.back(message, msgDB);
  }

  private isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;

    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.substring(10, 11));
  }

  private async back(message: any, msg: any) {
    const responseUser = {
      number: msg.number,
      name: msg.name,
      state_menu: 'back',
      state: 'menu.schedules.back',
      msg: message.body,
    };
    await this.repositorye.created(new Msg(responseUser));

    await this.menuService.execute(message);
  }
}
