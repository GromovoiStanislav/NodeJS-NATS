import { connect } from 'nats';
import Schema from './proto/employees_pb.cjs';

const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

// Подписка на тему
const sub = nc.subscribe('employees');

(async () => {
  for await (const msg of sub) {
    console.log('Обработка полученного сообщения:');

    const employees = Schema.Employees.deserializeBinary(msg.data);
    console.log(employees.toObject().employeesList);
    console.log();

    const employeesList = employees.getEmployeesList();
    employeesList.forEach((element) => {
      console.log(element.toObject());
      console.log('Id:', element.getId());
      console.log('Name:', element.getName());
      console.log('Salary:', element.getSalary());
      console.log();
    });
  }
})();
