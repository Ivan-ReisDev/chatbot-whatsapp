import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { RepositoryService } from '../repository/repository.service';
import { Msg } from 'src/entities/Msg';
import { MenuService } from '../menu/menu.service';
import { ScheduleService } from '../schedule/schedule.service';
import { ScheduleCreateService } from '../schedule.create/schedule.create.service';

@Injectable()
export class WhatsappService implements OnModuleInit {
  public client: Client;

  constructor(
    private repositorye: RepositoryService,
    private readonly eventEmitter: EventEmitter2,
    private menuService: MenuService,
    private scheduleService: ScheduleService,
    private scheduleCreateService: ScheduleCreateService,
  ) {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });
  }

  onModuleInit() {
    this.initializeClient();
  }

  private initializeClient() {
    this.client.on('ready', () => {
      console.log('Client is ready!');
    });

    this.client.on('auth_failure', (msg) => {
      console.error('Falha na autenticação:', msg);
    });

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('message', (message) => {
      this.handleMessage(message).catch((err) => {
        console.error('Erro ao processar mensagem:', err);
      });
    });

    this.client.initialize();
  }

  private async handleMessage(message: any) {
    try {
      const number = message.from.split('@')[0];
      const userMessage: Msg = await this.repositorye.findUniqui(number);

      if (!userMessage) {
        await this.client.sendMessage(
          message.from,
          'Olá! Seja muito bem-vindo(a)! 👋\n' +
            'Eu sou o *Agenda Hora*, o seu assistente especialista em economizar seu tempo. ⏳',
        );
        await this.client.sendMessage(message.from, 'Qual é o seu nome?');

        const responseUser = {
          number: number,
          name: 'empty',
          state_menu: 'empty',
          state: 'menu',
          msg: message.body,
        };

        const newMsg = new Msg(responseUser);
        await this.repositorye.created(newMsg);
      } else {
        await this.menuService.execute(message);
        switch (userMessage.state) {
          case 'menu':
            break;
          case 'schedule':
            this.scheduleService.execute(message);
            break;
          case 'schedule.created':
            this.scheduleCreateService.execute(message);
            break;

          default:
            break;
        }
      }
      // } else if (userMessage.state === 'menu') {
      //   const responseUser = {
      //     number: number,
      //     name: userMessage.name,
      //     state: 'menu.schedule',
      //     msg: message.body,
      //   };
      //   await this.repositorye.created(new Msg(responseUser));

      //   // Passa a mensagem para o serviço de agendamento
      //   //await this.scheduleService.handleSchedulingOption(message);
      // }
    } catch (error) {
      console.error('Erro no handleMessage:', error);
    }
  }
}
