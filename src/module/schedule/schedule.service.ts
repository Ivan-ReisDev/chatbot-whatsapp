import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleService {
  // Função para iniciar a criação de um agendamento
  async handleSchedulingOption(message: any) {
    const response = message.body.trim();

    if (response === '1') {
      // Se a opção for 1, você pode enviar os agendamentos, se houver
      await message.client.sendMessage(
        message.from,
        'Aqui estão seus agendamentos:', // Exemplo de mensagem com agendamentos
      );
      // A lógica para retornar os agendamentos pode ser implementada aqui
    } else if (response === '2') {
      // Quando o usuário escolhe criar um agendamento, envia a mensagem para digitar o CPF
      await message.client.sendMessage(
        message.from,
        'Digite seu CPF para começar o agendamento.',
      );
    } else {
      // Caso o usuário não escolha uma opção válida
      await message.client.sendMessage(
        message.from,
        'Opção inválida! Por favor, escolha uma das opções:\n' +
          '1. Ver meus agendamentos\n' +
          '2. Criar um novo agendamento\n',
      );
    }
  }
}
