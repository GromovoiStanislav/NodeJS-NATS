import { connect } from 'nats';
import Schema from './proto/types_pb.cjs';

// create a connection
const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

const req = new Schema.GreetRequest();
req.setName('Hussein');

// Отправка JSON-сообщения
const subject = 'greet';
let res = await nc.request(subject, req.serializeBinary());

res = Schema.GreetReply.deserializeBinary(res.data);
console.log(`Получен ответ: ${res.getText()}`);

await nc.drain();
