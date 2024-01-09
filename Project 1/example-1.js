import { connect, StringCodec } from 'nats';

// to create a connection to a nats-server:
const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

// create a codec
const sc = StringCodec();

const sub = nc.subscribe('hello');
(async () => {
  for await (const m of sub) {
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
  }
  console.log('subscription closed');
})();

nc.publish('hello', sc.encode('world'));
nc.publish('hello', sc.encode('again'));

await nc.drain();
