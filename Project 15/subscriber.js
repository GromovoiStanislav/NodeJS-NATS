import express from 'express';
import { connect, JSONCodec } from 'nats';

const app = express();
const port = process.env.PORT || 3002;

// Connect to NATS server
const nc = await connect({ servers: ['nats://0.0.0.0:4222'] });
const jc = JSONCodec();

const subject = 'mySubject';
nc.subscribe(subject, {
  callback: (err, msg) => {
    console.log('Received message:', jc.decode(msg.data));
  },
});

app.get('/', (req, res) => {
  res.send('Subscriber server is running.');
});

app.listen(port, () => {
  console.log(`Subscriber server listening on port ${port}`);
});
