import { connect } from 'nats';

// to create a connection to a nats-server:
const nc = await connect({ servers: 'demo.nats.io:4222' });

nc.publish('greet.bob', 'hello');

const sub = nc.subscribe('greet.*', { max: 3 });
(async () => {
  for await (const msg of sub) {
    console.log(`${msg.string()} on subject ${msg.subject}`);
  }
})();

nc.publish('greet.joe', 'hello');
nc.publish('greet.pam', 'hello');
nc.publish('greet.sue', 'hello');

await nc.drain();

// Output:
// hello on subject greet.joe
// hello on subject greet.pam
// hello on subject greet.sue
