import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';
import { Msg } from 'src/entities/Msg';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ScheduleService } from '../schedule/schedule.service';
import { ScheduleCreateService } from '../schedule.create/schedule.create.service';

@Injectable()
export class MenuService {
  constructor(
    private repositorye: RepositoryService,
    @Inject(forwardRef(() => WhatsappService))
    public whatsappService: WhatsappService,
    @Inject(forwardRef(() => ScheduleService))
    public scheduleService: ScheduleService,
    @Inject(forwardRef(() => ScheduleCreateService))
    public scheduleCreateService: ScheduleCreateService,
  ) {}

  public async execute(message: any) {
    const number = message.from.split('@')[0];
    const name: string = message.body.trim();
    const msgDB: Msg = await this.repositorye.findUniqui(number);
    const responseUser = {
      number: number,
      name: msgDB.name !== 'empty' ? msgDB.name : name,
      state_menu: 'waiting',
      state: 'menu',
      msg: message.body,
    };
    if (msgDB.name === 'empty') {
      await this.repositorye.created(new Msg(responseUser));

      await this.whatsappService.client.sendMessage(
        message.from,
        `Prazer em conhecer você, ${name}!`,
      );
    } else if (
      msgDB.state === 'menu.schedules.back' &&
      msgDB.state_menu === 'back'
    ) {
      await this.repositorye.created(new Msg(responseUser));
    }
    await this.templateOptionsMenu(message, msgDB);

    if (msgDB.state_menu === 'waiting') {
      await this.menuOptions(message, msgDB);
    }
  }

  private async templateOptionsMenu(message: any, msgDB: Msg) {
    if (msgDB.state_menu === 'empty' || msgDB.state_menu === 'back') {
      await this.whatsappService.client.sendMessage(
        message.from,
        `Olá! 👋 Como posso ajudar você hoje?z\nEscolha uma das opções abaixo e envie o número correspondente:  
      
      1️⃣ - *Ver meus agendamentos*  
      2️⃣ - *Criar um novo agendamento*  
      3️⃣ - *Falar com o suporte*  
      0️⃣ - *Finalizar atendimento*\n\nEstou aqui para facilitar sua vida! 😊`,
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

      case '2':
        const responseUsertwo = {
          number: msgDB.number,
          name: msgDB.name,
          state_menu: 'empty',
          state: 'schedule.created',
          msg: message.body,
        };
        await this.repositorye.created(new Msg(responseUsertwo));
        await this.scheduleCreateService.execute(message);
        break;

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
