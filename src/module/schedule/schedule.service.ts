import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { Msg } from 'src/entities/Msg';
import { RepositoryScheduleService } from '../repository/repository.schedule.service';
import { Schedule } from 'src/entities/Schedule';

@Injectable()
export class ScheduleService {
  constructor(
    private repositorye: RepositoryService,
    private repositoryScheduleService: RepositoryScheduleService,
    @Inject(forwardRef(() => WhatsappService))
    public whatsappService: WhatsappService,
  ) {}

  public async execute(message: any) {
    const number = message.from.split('@')[0];
    const msgDB: Msg = await this.repositorye.findUniqui(number);

    if (msgDB.state_menu === 'empty') {
      await this.whatsappService.client.sendMessage(
        message.from,
        `${msgDB.name}, por favor informe seu CPF para consulta`,
      );

      const responseUser = {
        number: msgDB.number,
        name: msgDB.name,
        state_menu: 'schedule.consultation',
        state: 'schedule',
        msg: message.body,
      };
      await this.repositorye.created(new Msg(responseUser));
      return;
    }

    if (!this.isValidCPF(message.body.trim())) {
      await this.whatsappService.client.sendMessage(
        message.from,
        `O CPF informado (${message.body.trim()}) é inválido. Por favor, tente novamente.`,
      );
      return;
    }

    const cpf = message.body.replace(/\D/g, '');

    const schedules = await this.repositoryScheduleService.findUniqui(cpf);

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

    await this.whatsappService.client.sendMessage(
      message.from,
      `CPF válido! Continuando com a consulta...`,
    );
    // if (msgDB.state_menu === 'waiting') {
    //   await this.menuOptions(message, msgDB);
    // }
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
}
