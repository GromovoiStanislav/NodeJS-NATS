const logsDB = [];

export const getLogList = async () => {
  return logsDB;
};

export const writeLog = async (data) => {
  const newUser = {
    date: new Date(),
    event: data,
  };

  logsDB.push(newUser);
};
