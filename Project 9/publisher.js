import { connect } from 'nats';
import Schema from './proto/employees_pb.cjs';

// create a connection
const nc = await connect({ servers: 'nats://127.0.0.1:4222' });

const hussein = new Schema.Employee();
hussein.setId(1001);
hussein.setName('Hussein');
hussein.setSalary(3000);

const ahmed = new Schema.Employee();
ahmed.setId(1002);
ahmed.setName('Ahmed');
ahmed.setSalary(9000);

const rick = new Schema.Employee();
rick.setId(1003);
rick.setName('Rick');
rick.setSalary(5000);

const employees = new Schema.Employees();
employees.addEmployees(hussein);
employees.addEmployees(ahmed);
employees.addEmployees(rick);

// Отправка JSON-сообщения
const subject = 'employees';
nc.publish(subject, employees.serializeBinary());

await nc.drain();
