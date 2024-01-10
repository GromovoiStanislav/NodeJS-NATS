import { connect } from 'nats';
import protobuf from 'protobufjs';

// create a connection
const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

// Загрузите описание протобуфера из файла
const root = protobuf.loadSync('proto/awesome.proto');

// Получите тип сообщения для вашей структуры данных
const AwesomeMessage = root.lookupType('awesomepackage.AwesomeMessage');

{
  // Создайте объект данных
  const payload = { awesomeField: 'AwesomeString' };

  // Verify the payload if necessary
  const errMsg = AwesomeMessage.verify(payload);
  if (errMsg) throw Error(errMsg);

  // Create a new message
  const message = AwesomeMessage.create(payload); // .fromObject if conversion is necessary
  console.log(message);

  // Encode a message to an Uint8Array (browser) or Buffer (node)
  const buffer = AwesomeMessage.encode(message).finish();

  // Отправка protobuf-сообщения
  const subject = 'awesome';
  nc.publish(subject, buffer);
}

{
  // Создайте объект данных
  const payload = { awesomeField: 'AwesomeNewString' };

  // Verify the payload if necessary
  const errMsg = AwesomeMessage.verify(payload);
  if (errMsg) throw Error(errMsg);

  // Create a new message
  const message = AwesomeMessage.fromObject(payload); // .create
  console.log(message);

  // Encode a message to Buffer
  const buffer = AwesomeMessage.encode(message).finish();

  // Отправка protobuf-сообщения
  const subject = 'awesome';
  nc.publish(subject, buffer);
}

await nc.drain();
