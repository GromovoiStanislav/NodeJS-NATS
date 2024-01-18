import { StringCodec, connect } from 'nats';

const main = async () => {
  const nc = await connect({ servers: 'nats://127.0.0.1:4222' });
  console.log('Connected to NATS');

  const sc = StringCodec();

  const sub = nc.subscribe('notif');
  (async () => {
    for await (const m of sub) {
      console.log(
        `[${sub.getProcessed()}]: Received msg: ${sc.decode(m.data)}`
      );
    }
  })();
};

main();
