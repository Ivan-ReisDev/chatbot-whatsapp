import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { RepositoryService } from '../repository/repository.service';
import { Msg } from 'src/entities/Msg';
import { ScheduleService } from '../schedule/schedule.service'; // Importando o serviço de agendamentos

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;

  constructor(
    private repositorye: RepositoryService,
    private readonly eventEmitter: EventEmitter2,
    private scheduleService: ScheduleService, // Injetando o serviço de agendamentos
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
      const userMessage = await this.repositorye.findUniqui(number);

      if (!userMessage) {
        await this.client.sendMessage(
          message.from,
          `Olá! Seja bem-vindo! \n Meu nome é *Agenda Hora* e meu lema é economia de tempo!`,
        );
        await this.client.sendMessage(message.from, 'Qual é o seu nome?');

        const responseUser = {
          number: number,
          name: '',
          state: 'start',
          msg: message.body,
        };

        const newMsg = new Msg(responseUser);
        await this.repositorye.created(newMsg);
      } else if (userMessage.state === 'start') {
        const name = message.body.trim();

        const responseUser = {
          number: number,
          name: message.body,
          state: 'menu',
          msg: message.body,
        };
        await this.repositorye.created(new Msg(responseUser));

        await this.client.sendMessage(
          message.from,
          `Prazer em conhecer você, ${name}!`,
        );
        await this.client.sendMessage(
          message.from,
          'Como posso ajudar você hoje? Escolha uma das opções abaixo:\n\n' +
            '1. Ver meus agendamentos\n' +
            '2. Criar um novo agendamento\n' +
            '3. Falar com o suporte\n\n' +
            'Envie o número da opção desejada.',
        );
      } else if (userMessage.state === 'menu') {
        const responseUser = {
          number: number,
          name: userMessage.name,
          state: 'menu.schedule',
          msg: message.body,
        };
        await this.repositorye.created(new Msg(responseUser));

        // Passa a mensagem para o serviço de agendamento
        await this.scheduleService.handleSchedulingOption(message);
      }
    } catch (error) {
      console.error('Erro no handleMessage:', error);
    }
  }
}
