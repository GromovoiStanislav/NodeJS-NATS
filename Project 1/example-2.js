import { connect, JSONCodec } from 'nats';

// to create a connection to a nats-server:
const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

// create a codec
const jc = JSONCodec();

const sub = nc.subscribe('add');
(async () => {
  for await (const m of sub) {
    console.log(
      `[${sub.getProcessed()}]: {a: ${jc.decode(m.data).a}, b: ${
        jc.decode(m.data).b
      }}`
    );
  }
  console.log('subscription closed');
})();

nc.publish('add', jc.encode({ a: 10, b: 20 }));
nc.publish('add', jc.encode({ a: 2, b: 5 }));

await nc.drain();
