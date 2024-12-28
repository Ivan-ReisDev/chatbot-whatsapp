import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';
import { ScheduleService } from '../schedule/schedule.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { Msg } from 'src/entities/Msg';
import { ConfigService } from '../config/config.service';
import { RepositoryScheduleService } from '../repository/repository.schedule.service';
import { Schedule } from 'src/entities/Schedule';

@Injectable()
export class ScheduleCreateService {
  constructor(
    private configService: ConfigService,
    private repositoryScheduleService: RepositoryScheduleService,
    private repository: RepositoryService,
    @Inject(forwardRef(() => WhatsappService))
    public whatsappService: WhatsappService,
    @Inject(forwardRef(() => ScheduleService))
    public scheduleService: ScheduleService,
  ) {}

  public async execute(message: any) {
    const number = message.from.split('@')[0];
    const msgDB: Msg = await this.repository.findUniqui(number);

    if (msgDB.state_menu === 'empty') {
      const availableDates = await this.getNextAvailableDates();
      const messageContent = await this.generateDatesMessage(
        msgDB.name,
        availableDates,
      );

      await this.whatsappService.client.sendMessage(
        message.from,
        messageContent,
      );

      const responseUser: Msg = {
        number: msgDB.number,
        name: msgDB.name,
        state_menu: 'waiting.date',
        state: 'schedule.created',
        msg: message.body,
        msgBot: availableDates,
      };
      await this.repository.created(new Msg(responseUser));
      return;
    }

    await this.controller(message, msgDB);
  }

  private async getNextAvailableDates(): Promise<
    { date: Date; day: string }[]
  > {
    const config = await this.configService.find();
    const operatingHours = config.operatingHours;
    const today = new Date();
    const availableDates: { date: Date; day: string }[] = [];
    let daysAdded = 0;

    while (daysAdded < 7) {
      today.setDate(today.getDate() + 1);
      const weekday = today.toLocaleDateString('pt-BR', { weekday: 'long' });

      const operatingDay = operatingHours.find(
        (day) => day.dayOfWeek === weekday,
      );

      if (operatingDay) {
        availableDates.push({
          date: new Date(today),
          day: operatingDay.dayOfWeek,
        });
        daysAdded++;
      }
    }

    return availableDates;
  }

  private async generateDatesMessage(
    name: string,
    dates: { date: Date; day: string }[],
  ): Promise<string> {
    const formattedDates = dates.map(
      (entry) =>
        `${entry.date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        })} (${entry.day})`,
    );

    return `
    *${name}* 😊, escolha a melhor data para agendamento! Aqui estão as opções disponíveis:

${formattedDates.map((date, index) => `${index + 1}. *${date}*`).join('\n')}
    
    Por favor, responda com o número correspondente à data que você prefere 📅. 
    
    Aguardo sua resposta para continuar o agendamento! 💼 
    `.trim();
  }

  private async getNextAvailableHora(
    message: any,
    msgDB: Msg,
  ): Promise<string> {
    const config = await this.configService.find();
    const dateAvailable = await this.repositoryScheduleService.findAll(
      msgDB.msgBot[0].date,
    );

    // Configuração das horas de funcionamento
    const operatingHours = config.operatingHours;
    const selectedDate = new Date(msgDB.msgBot[0].date);
    const availableHours: string[] = [];

    // Encontrar o dia da semana correspondente
    const selectedDayOfWeek = selectedDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
    });

    const operatingDay = operatingHours.find(
      (day) => day.dayOfWeek === selectedDayOfWeek,
    );

    if (!operatingDay) {
      return 'Parece que não há horários disponíveis para este dia. 😔 Que tal tentar outro dia? 📅';
    }

    const startHour = parseInt(operatingDay.openingTime.split(':')[0]);
    const endHour = parseInt(operatingDay.closingTime.split(':')[0]);

    // Gerar os horários disponíveis
    for (let hour = startHour; hour < endHour; hour++) {
      const isBooked = dateAvailable.some((schedule) => {
        const scheduledTime = new Date(schedule.date);
        return scheduledTime.getHours() === hour;
      });

      if (!isBooked) {
        availableHours.push(`${hour}h`);
      }
    }

    if (availableHours.length <= 0) {
      return 'Puxa, todos os horários estão ocupados para este dia. 😕 Que tal tentar em outro momento? ⏰';
    }

    return `✨ Olá! Aqui estão os horários disponíveis para agendamento: ✨
  ${availableHours
    .map((hour, index) => `${index + 1} - ${hour}`) // Adicionando a numeração
    .join('\n')} 🕒
  
  Por favor, responda com o número do horário desejado para confirmarmos o agendamento. Estamos aguardando sua escolha! 😊`;
  }

  private async controller(message: any, msgDB: Msg) {
    switch (msgDB.state_menu) {
      case 'waiting.date':
        await this.requestUserDate(message, msgDB);
        break;
      case 'waiting.time':
        // Adicionar lógica para estado 'waiting.time' caso necessário
        break;
    }
  }

  private async requestUserDate(message: any, msgDB: Msg) {
    const count: number = +message.body - 1;
    const selectedDate = msgDB.msgBot[count];
    const responseUser: Msg = {
      number: msgDB.number,
      name: msgDB.name,
      state_menu: 'waiting.time',
      state: 'schedule.created',
      msg: message.body,
      msgBot: [selectedDate],
    };

    const schedule: Schedule = {
      number: msgDB.number,
      name: msgDB.name,
      date: selectedDate.date,
    };

    await this.repository.created(new Msg(responseUser));

    await this.repositoryScheduleService.created(new Schedule(schedule));

    const contentHora = await this.getNextAvailableHora(message, msgDB);
    await this.whatsappService.client.sendMessage(message.from, contentHora);
  }

  // private async requestUserhora(message: any, msgDB: Msg) {
  //   const count: number = +message.body - 1;
  //   const selectedDate = msgDB.msgBot[count];

  //   const responseUser: Msg = {
  //     number: msgDB.number,
  //     name: msgDB.name,
  //     state_menu: 'waiting.time',
  //     state: 'schedule.created',
  //     msg: message.body,
  //     msgBot: selectedDate,
  //   };

  //   const schedule: Schedule = {
  //     number: msgDB.number,
  //     name: msgDB.name,
  //     date: selectedDate.date,
  //   };

  //   await this.repository.created(new Msg(responseUser));
  //   await this.repositoryScheduleService.created(new Schedule(schedule));

  //   const contentHora = await this.getNextAvailableHora(message, msgDB);
  //   await this.whatsappService.client.sendMessage(message.from, contentHora);
  // }
}
