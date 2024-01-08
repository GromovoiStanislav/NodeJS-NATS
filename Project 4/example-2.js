import { connect, Empty } from 'nats';

// to create a connection to a nats-server:
const nc = await connect({ servers: 'demo.nats.io:4222' });

nc.subscribe('foo1', {
  callback: (err, msg) => {
    if (err) {
      console.log('subscription error', err.message);
      return;
    }

    console.log('foo1', msg.string());

    msg.respond(msg.string());
  },
});

nc.subscribe('foo2', {
  callback: (err, msg) => {
    if (err) {
      console.log('subscription error', err.message);
      return;
    }

    console.log('foo2', msg.string());

    msg.respond(msg.string());
  },
});

let rep = await nc.request('foo1', 'Hi', { reply: 'foo2', noMux: true });
console.log('request:', rep.string());

await nc.drain();

// Output:
// foo1 Hi
// foo2 Hi
// request: Hi
