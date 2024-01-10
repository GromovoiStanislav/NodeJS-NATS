import { connect } from 'nats';
import Schema from './proto/types_pb.cjs';

const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

// Подписка на тему
const sub = nc.subscribe('greet');

(async () => {
  for await (const msg of sub) {
    // Обработка полученного сообщения
    const req = Schema.GreetRequest.deserializeBinary(msg.data);
    console.log(`Получено сообщение: ${req.getName()}`);

    // Отправляем ответ
    const rep = new Schema.GreetReply();
    rep.setText(`Hello ${req.getName()}`);
    msg.respond(rep.serializeBinary());
  }
})();
