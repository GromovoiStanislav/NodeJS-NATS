import { connect } from 'nats';
import { createUser, getUsersList } from './users-DB.js';
import { writeLog, getLogList } from './logs-DB.js';

export const nats = await connect({ servers: ['nats://0.0.0.0:4222'] });

nats.subscribe('HELLO', {
  callback: async (err, msg) => {
    if (err) {
      console.log('subscription error', err.message);

      // error case
      const error = {
        success: false,
        message: 'Some error occurred',
        status: 500,
        code: 'SOME_ERROR',
      };

      msg.respond(JSON.stringify(error));
      return;
    }

    const data = {
      success: true,
      data: { message: 'Hello NATS' },
    };

    msg.respond(JSON.stringify(data));

    nats.publish('LOG:write', 'HELLO');
  },
});

nats.subscribe('USERS.create', {
  callback: async (err, msg) => {
    if (err) {
      console.log('subscription error', err.message);

      // error case
      const error = {
        success: false,
        message: 'Some error occurred',
        status: 500,
        code: 'SOME_ERROR',
      };

      msg.respond(JSON.stringify(error));
      return;
    }

    const newUser = await createUser(msg.json().data);

    const data = {
      success: true,
      data: newUser,
    };

    msg.respond(JSON.stringify(data));
    nats.publish('LOG:write', 'USERS.create');
  },
});

nats.subscribe('USERS.list', {
  callback: async (err, msg) => {
    if (err) {
      console.log('subscription error', err.message);

      // error case
      const error = {
        success: false,
        message: 'Some error occurred',
        status: 500,
        code: 'SOME_ERROR',
      };

      msg.respond(JSON.stringify(error));
      return;
    }

    const users = await getUsersList();

    const data = {
      success: true,
      data: users,
    };

    msg.respond(JSON.stringify(data));
    nats.publish('LOG:write', 'USERS.list');
  },
});

nats.subscribe('LOG:write', {
  callback: async (err, msg) => {
    if (err) {
      console.log('subscription error', err.message);
      return;
    }

    await writeLog(msg.string());
  },
});

nats.subscribe('LOG.list', {
  callback: async (err, msg) => {
    if (err) {
      console.log('subscription error', err.message);

      // error case
      const error = {
        success: false,
        message: 'Some error occurred',
        status: 500,
        code: 'SOME_ERROR',
      };

      msg.respond(JSON.stringify(error));
      return;
    }

    const logs = await getLogList();

    const data = {
      success: true,
      data: logs,
    };

    msg.respond(JSON.stringify(data));
    nats.publish('LOG:write', 'USERS.list');
  },
});
