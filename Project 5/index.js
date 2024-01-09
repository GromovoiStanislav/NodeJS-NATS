import { connect } from 'nats';

// to create a connection to a nats-server:
const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

const sub = await nc.subscribe('foo', { max: 2 });
(async () => {
  for await (const m of sub) {
    try {
      const obj = m.json();
      console.log(obj);
      console.log(obj.foo, obj.bar);
    } catch (err) {
      console.log(`err: ${err.message}: '${m.string()}'`);
    }
  }
})();

nc.publish('foo', JSON.stringify({ foo: 'bar', bar: 27 }));
nc.publish('foo', 'not json');
nc.publish('foo', JSON.stringify({ foo: 'bar', bar: 28 }));

await nc.drain();

// Output:
// { foo: 'bar', bar: 27 }
// bar 27
// err: Bad JSON: 'not json'
