import { connect } from 'nats';
import protobuf from 'protobufjs';

const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

// Загрузите описание протобуфера из файла
const root = protobuf.loadSync('proto/awesome.proto');

// Получите тип сообщения для вашей структуры данных
const AwesomeMessage = root.lookupType('awesomepackage.AwesomeMessage');

// Подписка на тему
const sub = nc.subscribe('awesome');

(async () => {
  for await (const msg of sub) {
    // Decode Buffer to a message
    const message = AwesomeMessage.decode(msg.data);
    console.log(message);
    console.log('Полученно сообщение:', message.awesomeField);

    // Maybe convert the message back to a plain object
    const object = AwesomeMessage.toObject(message, {
      longs: String,
      enums: String,
      bytes: String,
      // see ConversionOptions
    });
    console.log(object);
    console.log('Полученно сообщение:', object.awesomeField);
    console.log();
  }
})();
