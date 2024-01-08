import { connect, Empty } from 'nats';

// to create a connection to a nats-server:
const nc = await connect({ servers: 'demo.nats.io:4222' });

const sub = nc.subscribe('greet.*', {
  callback: (err, msg) => {
    if (err) {
      console.log('subscription error', err.message);
      return;
    }

    const name = msg.subject.substring(6);
    msg.respond(`hello, ${name}`);
  },
});

let rep = await nc.request('greet.joe');
console.log(rep.string());

rep = await nc.request('greet.sue', 'hello!');
console.log(rep.string());

rep = await nc.request('greet.bob', Empty, { timeout: 3000 });
console.log(rep.string());

sub.unsubscribe();

nc.request('greet.joe').catch((err) => {
  console.log(
    'request failed with: ',
    err.code === '503' ? 'timeout' : err.message
  );
});

await nc.drain();

// Output:
// hello, joe
// hello, sue
// hello, bob
// request failed with:  timeout
