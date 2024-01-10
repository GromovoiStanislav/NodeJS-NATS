import { connect } from 'nats';

// create a connection
const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

const message = {
  text: 'Hello NATS from Node.js!',
};

// Создание JSON-сообщения
const payload = JSON.stringify(message);

// Отправка JSON-сообщения
const subject = 'your_subject';
nc.publish(subject, payload);

await nc.drain();
