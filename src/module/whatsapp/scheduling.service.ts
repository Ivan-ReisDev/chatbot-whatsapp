// import { Injectable } from '@nestjs/common';
// import { Client } from 'whatsapp-web.js';

// @Injectable()
// export class SchedulingService {
//   private client: Client;

//   constructor(client: Client) {
//     this.client = client;
//   }

//   public handleSchedulingMenu(message: any, chatExist: any) {
//     const schedulingOptions = `_Assistente:_ *Agendar Horário*

//         Por favor, selecione uma opção:
//         1. Escolher data e hora para agendamento;
//         2. Consultar horários disponíveis;
//         3. Voltar ao menu principal;
//       `;
//     this.client.sendMessage(message.from, schedulingOptions).catch((error) => {
//       console.error('Erro ao enviar mensagem:', error);
//     });
//   }

//   // Novo método handleSchedulingChoice
//   public handleSchedulingChoice(message: any, chatExist: any) {
//     if (message.body === '1') {
//       // Lógica para escolher data e hora
//       this.client.sendMessage(
//         message.from,
//         'Por favor, escolha a data e hora para o agendamento.',
//       );
//     } else if (message.body === '2') {
//       // Lógica para consultar horários disponíveis
//       this.client.sendMessage(
//         message.from,
//         'Aqui estão os horários disponíveis...',
//       );
//     } else if (message.body === '3') {
//       // Voltar ao menu principal
//       this.client.sendMessage(message.from, 'Voltando ao menu principal...');
//       this.client.sendMessage(
//         message.from,
//         'O que você gostaria de fazer a seguir?',
//       );
//     } else {
//       this.client.sendMessage(message.from, 'Opção inválida, tente novamente.');
//     }

// }
