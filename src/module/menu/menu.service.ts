import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';
import { Msg } from 'src/entities/Msg';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ScheduleService } from '../schedule/schedule.service';

@Injectable()
export class MenuService {
  constructor(
    private repositorye: RepositoryService,
    @Inject(forwardRef(() => WhatsappService))
    public whatsappService: WhatsappService,
    public scheduleService: ScheduleService,
  ) {}

  public async execute(message: any, msgDB: Msg) {
    const number = message.from.split('@')[0];
    const name: string = message.body.trim();
    if (msgDB.name === 'empty') {
      //registra nome
      const responseUser = {
        number: number,
        name: name,
        state_menu: 'waiting',
        state: 'menu',
        msg: message.body,
      };
      await this.repositorye.created(new Msg(responseUser));

      await this.whatsappService.client.sendMessage(
        message.from,
        `Prazer em conhecer você, ${name}!`,
      );
      await this.templateOptionsMenu(message, msgDB);
    }

    if (msgDB.state_menu === 'waiting') {
      await this.menuOptions(message, msgDB);
    }
  }

  private async templateOptionsMenu(message: any, msgDB: Msg) {
    if (msgDB.state_menu === 'empty') {
      await this.whatsappService.client.sendMessage(
        message.from,
        'Como posso ajudar você hoje? Escolha uma das opções abaixo:\n\n' +
          '1. Ver meus agendamentos\n' +
          '2. Criar um novo agendamento\n' +
          '3. Falar com o suporte\n' +
          '0. Finalizar atendimento\n\n' +
          'Envie o número da opção desejada.',
      );
    }
  }

  private async menuOptions(message: any, msgDB: Msg) {
    switch (message.body) {
      //chama menu 1
      case '1':
        const responseUser = {
          number: msgDB.number,
          name: msgDB.name,
          state_menu: 'empty',
          state: 'schedule',
          msg: message.body,
        };
        await this.repositorye.created(new Msg(responseUser));
        await this.scheduleService.execute(message);
        break;
      //chama menu 2
      case '2':
        console.log('Você selecionou 2');
        break;
      //chama menu 3
      case '3':
        console.log('Você selecionou 3');
        break;

      case '0':
        await this.repositorye.deleteHistory(msgDB.number);

        await this.whatsappService.client.sendMessage(
          message.from,
          'Atendimento encerrado com sucesso!',
        );
        await this.whatsappService.client.sendMessage(
          message.from,
          'Caso queira um novo atendimento basta me chamar!',
        );

        break;

      default:
        await this.whatsappService.client.sendMessage(
          message.from,
          'Por favor selecione uma opção válida',
        );
    }
  }
}
