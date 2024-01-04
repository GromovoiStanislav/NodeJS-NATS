import { connect, JSONCodec } from 'nats';

const nc = await connect({ servers: 'demo.nats.io:4222' });
const jc = JSONCodec();

const generateClientName = () => {
  const num = new Date().getTime();
  return 'node-client-' + num;
};

// Simple Subscriber
nc.subscribe('cannel-test', async (msg) => {
  console.log('Received a message: ', msg);
});
const sub = nc.subscribe('cannel-test');
(async () => {
  for await (const msg of sub) {
    console.log('Received a message: ', jc.decode(msg.data));
  }
  console.log('subscription closed');
})();

// Simple Publisher
nc.publish(
  'cannel-test',
  jc.encode({
    client: generateClientName(),
    message: 'The Mom is on',
  })
);

await nc.drain();
