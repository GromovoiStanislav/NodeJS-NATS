import express from 'express';
import { connect, JSONCodec } from 'nats';

const app = express();
const port = process.env.PORT || 3001;

// Connect to NATS server
const nc = await connect({ servers: ['nats://0.0.0.0:4222'] });
const jc = JSONCodec();

app.post('/publish/:message', (req, res) => {
  const message = req.params.message;

  const subject = 'mySubject';
  nc.publish(subject, jc.encode({ message }));

  res.status(201).send(`Message sent: ${message}`);
});

app.listen(port, () => {
  console.log(`Publisher server listening on port ${port}`);
});
