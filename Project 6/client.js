import { connect, StringCodec } from 'nats';

// create a connection
const nc = await connect({ servers: 'demo.nats.io:4222' });

// create an encoder
const sc = StringCodec();

await nc
  .request('echo', sc.encode('Hello'), { timeout: 1000 })
  .then((m) => {
    console.log(`got response: ${sc.decode(m.data)}`);
  })
  .catch((err) => {
    console.log(`problem with request: ${err.message}`);
  });

await nc.close();
