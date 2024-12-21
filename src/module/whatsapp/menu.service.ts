// import { Injectable } from '@nestjs/common';
// import { SchedulingService } from './scheduling.service';
// import { IChatClient } from './whatsapp.service';

// @Injectable()
// export class MenuService {
//   constructor(private readonly schedulingService: SchedulingService) {}

//   // Método para lidar com o menu
//   public handleMenuOptions(message: any) {
//     const menuOptions = `_Assistente:_ *Agenda Hora*

//     Por favor, selecione uma opção para avançar:
//     1. Agendar Horário;
//     2. Consultar Agendamento;
//     3. Sair;
//     `;
//     // Apenas envia o menu para o usuário
//     message.client.sendMessage(message.from, menuOptions);
//   }
// }
