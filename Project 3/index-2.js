import { connect, StringCodec } from 'nats';

// to create a connection to a nats-server:
const nc = await connect({ servers: 'demo.nats.io:4222' });

// create a codec
const sc = StringCodec();

nc.publish('greet.bob', sc.encode('hello'));

const sub = nc.subscribe('greet.*', { max: 3 });
(async () => {
  for await (const msg of sub) {
    console.log(`${sc.decode(msg.data)} on subject ${msg.subject}`);
  }
})();

nc.publish('greet.joe', sc.encode('hello'));
nc.publish('greet.pam', sc.encode('hello'));
nc.publish('greet.sue', sc.encode('hello'));

await nc.drain();

// Output:
// hello on subject greet.joe
// hello on subject greet.pam
// hello on subject greet.sue
