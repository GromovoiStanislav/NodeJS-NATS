import { connect } from 'nats';

const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

// Подписка на тему
const sub = nc.subscribe('your_subject');

(async () => {
  for await (const msg of sub) {
    // Обработка полученного JSON-сообщения
    const receivedMessage = JSON.parse(msg.data);
    console.log('Получено JSON-сообщение:', receivedMessage);
  }
})();
