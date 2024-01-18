import { StringCodec, connect } from 'nats';
const main = async () => {
    const nc = await connect({ servers: 'nats://127.0.0.1:4222' });
    console.log('Connected to NATS');
    const sc = StringCodec();
    setInterval(() => nc.publish('notif', sc.encode('world')), 1000);
    //await nc.drain();
};
main();
