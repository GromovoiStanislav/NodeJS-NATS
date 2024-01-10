import express, { json } from 'express';
import { NatsAgent } from './nats-agent.js';

const natsAgent = new NatsAgent();
await natsAgent.initializeAgent({ servers: ['0.0.0.0:4222'] });

const port = 3000;
const host = 'localhost';

const app = express();
app.use(json());
app.get('/', rootAction);
app.get('/users', listUsersAction);
app.post('/users', createUsersAction);

app.listen(port, host);
console.log(`HttpServer listened at ${host}:${port}`);

function rootAction(req, res) {
  res.json({ message: 'Hello World' });
}

async function listUsersAction(req, res) {
  const payload = {
    __params: {},
  };

  try {
    const response = await natsAgent.request('USERS.list', payload);
    const result = response.json();

    if (result.success) {
      res.json(result.data);
    } else {
      res
        .status(result.status)
        .json({ message: result.message, code: result.code });
    }
  } catch (e) {
    res.status(e.status || 500).json(e);
  }
}

async function createUsersAction(req, res) {
  const { body } = req;

  const payload = {
    __params: {},
    data: body,
  };

  try {
    const response = await natsAgent.request('USERS.create', payload);
    const result = response.json();

    if (result.success) {
      res.status(201).json(result.data);
    } else {
      res
        .status(result.status)
        .json({ message: result.message, code: result.code });
    }
  } catch (e) {
    res.status(e.status || 500).json(e);
  }
}
