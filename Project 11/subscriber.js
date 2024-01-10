import { connect } from 'nats';
import protobuf from 'protobufjs';

const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

// Загрузите описание протобуфера из файла
const root = protobuf.loadSync('proto/employees.proto');

// Получите тип сообщения для вашей структуры данных
const Employee = root.lookupType('main.Employee');
const Employees = root.lookupType('main.Employees');

// Подписка на тему
const sub = nc.subscribe('employees');

(async () => {
  for await (const msg of sub) {
    // Decode Buffer to a message
    const message = Employees.decode(msg.data);
    console.log(message);

    console.log();

    // Maybe convert the message back to a plain object
    const object = Employees.toObject(message, {
      longs: String,
      enums: String,
      bytes: String,
      // see ConversionOptions
    });
    console.log(object);

    message.employees.forEach((element) => {
      console.log(Employee.toObject(element));
      console.log(element);
      console.log('Id:', element.id);
      console.log('Name:', element.name);
      console.log('Salary:', element.salary);
      console.log();
    });
  }
})();
