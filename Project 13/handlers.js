import { nats as natsAgent } from './nats-server.js';

export const rootAction = async (req, res) => {
  const payload = {
    __params: {},
  };

  try {
    const response = await natsAgent.request('HELLO', JSON.stringify(payload));
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
};

export const listUsersAction = async (req, res) => {
  const payload = {
    __params: {},
  };

  try {
    const response = await natsAgent.request(
      'USERS.list',
      JSON.stringify(payload)
    );
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
};

export const createUsersAction = async (req, res) => {
  const { body } = req;

  const payload = {
    __params: {},
    data: body,
  };

  try {
    const response = await natsAgent.request(
      'USERS.create',
      JSON.stringify(payload)
    );
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
};

export const listLogsAction = async (req, res) => {
  const payload = {
    __params: {},
  };

  try {
    const response = await natsAgent.request(
      'LOG.list',
      JSON.stringify(payload)
    );
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
};
