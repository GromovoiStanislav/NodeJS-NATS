import express, { json } from 'express';
import {
  rootAction,
  listUsersAction,
  createUsersAction,
  listLogsAction,
} from './handlers.js';

const port = 3000;
const host = 'localhost';

const app = express();
app.use(json());
app.get('/', rootAction);
app.get('/users', listUsersAction);
app.post('/users', createUsersAction);
app.get('/logs', listLogsAction);

app.listen(port, host);
console.log(`HttpServer listened at ${host}:${port}`);
