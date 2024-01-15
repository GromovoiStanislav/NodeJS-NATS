import { v4 as uuidv4 } from 'uuid';

const usersDB = [];

export const getUsersList = async () => {
  return usersDB;
};

export const createUser = async (data) => {
  const newUser = {
    userId: uuidv4(),
    createdAt: new Date(),
    ...data,
  };

  usersDB.push(newUser);

  return newUser;
};
