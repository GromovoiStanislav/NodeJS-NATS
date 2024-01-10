import { v4 as uuidv4 } from 'uuid';
import { NatsAgent } from './nats-agent.js';

const usersDB = [
  {
    userId: uuidv4(),
    createdAt: new Date(),
  },
  {
    userId: uuidv4(),
    createdAt: new Date(),
  },
];

async function getUsersList() {
  return usersDB;
}

async function createUser(data) {
  const newUser = {
    userId: uuidv4(),
    createdAt: new Date(),
    ...data,
  };

  usersDB.push(newUser);

  return newUser;
}

class UnitServer {
  constructor() {
    this.initialize();
  }

  async initialize() {
    this.natsAgent = new NatsAgent();
    await this.natsAgent.initializeAgent({ servers: ['0.0.0.0:4222'] });

    console.log(`${this.constructor.name} initialized...`);

    this.createUserAction();
    this.listUserAction();
  }
  catch(error) {
    console.error(`${this.constructor.name} initialization error:`, error);
  }

  async createUserAction() {
    const sub = this.natsAgent.subscribe('USERS.create');
    (async (sub) => {
      for await (const msg of sub) {
        const user = await createUser(msg.json().data);

        const data = {
          success: true,
          data: user,
        };

        // error case
        const error = {
          success: false,
          message: 'Some error occurred',
          status: 400,
          code: 'VALIDATION_ERROR',
        };

        msg.respond(JSON.stringify(data));
      }
    })(sub);
  }

  async listUserAction() {
    const sub = this.natsAgent.subscribe('USERS.list');

    (async (sub) => {
      for await (const msg of sub) {
        const users = await getUsersList();

        const data = {
          success: true,
          data: users,
        };

        msg.respond(JSON.stringify(data));
      }
    })(sub);
  }
}

new UnitServer();
