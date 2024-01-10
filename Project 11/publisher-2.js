import { connect } from 'nats';
import protobuf from 'protobufjs';

// create a connection
const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

// Загрузите описание протобуфера из файла
const root = protobuf.loadSync('proto/employees.proto');

// Получите тип сообщения для вашей структуры данных
const Employee = root.lookupType('main.Employee');
const Employees = root.lookupType('main.Employees');

// Создайте объект данных
const payload = { employees: [] };

const hussein = {
  id: 1001,
  name: 'Hussein',
  salary: 3000,
};
{
  // Verify the payload if necessary
  const errMsg = Employee.verify(hussein);
  if (errMsg) throw Error(errMsg);
}
payload.employees.push(hussein);

const ahmed = {
  id: 1002,
  name: 'Ahmed',
  salary: 9000,
};
{
  // Verify the payload if necessary
  const errMsg = Employee.verify(ahmed);
  if (errMsg) throw Error(errMsg);
}
payload.employees.push(ahmed);

const rick = {
  id: 1003,
  name: 'Rick',
  salary: 5000,
};
{
  // Verify the payload if necessary
  const errMsg = Employee.verify(rick);
  if (errMsg) throw Error(errMsg);
}
payload.employees.push(rick);

// Verify the payload if necessary
const errMsg = Employees.verify(payload);
if (errMsg) throw Error(errMsg);

// Create a new message
const message = Employees.fromObject(payload);
console.log(message);

// Encode a message to an Uint8Array (browser) or Buffer (node)
const buffer = Employees.encode(message).finish();

// Отправка protobuf-сообщения
const subject = 'awesome';
nc.publish(subject, buffer);

await nc.drain();
