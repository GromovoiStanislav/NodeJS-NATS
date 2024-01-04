import { connect, StringCodec } from 'nats';

// create a connection
const nc = await connect({ servers: 'demo.nats.io' });

// create a codec
const sc = StringCodec();

// this subscription listens for `time` requests and returns the current time
const subscription = nc.subscribe('time');
(async (sub) => {
  console.log(`listening for ${sub.getSubject()} requests...`);
  for await (const m of sub) {
    if (m.respond(sc.encode(new Date().toISOString()))) {
      console.info(`[time] handled #${sub.getProcessed()}`);
    } else {
      console.log(`[time] #${sub.getProcessed()} ignored - no reply subject`);
    }
  }
  console.log(`subscription ${sub.getSubject()} drained.`);
})(subscription);

// this subscription listens for admin.uptime and admin.stop
// requests to admin.uptime returns how long the service has been running
// requests to admin.stop gracefully stop the client by draining
// the connection
const started = Date.now();
const msub = nc.subscribe('admin.*');
(async (sub) => {
  console.log(`listening for ${sub.getSubject()} requests [uptime | stop]`);

  for await (const m of sub) {
    const chunks = m.subject.split('.');
    console.info(`[admin] #${sub.getProcessed()} handling ${chunks[1]}`);
    switch (chunks[1]) {
      case 'uptime':
        // send the number of millis since up
        m.respond(sc.encode(`${Date.now() - started}`));
        break;
      case 'stop': {
        m.respond(sc.encode(`[admin] #${sub.getProcessed()} stopping....`));
        // gracefully shutdown
        nc.drain().catch((err) => {
          console.log('error draining', err);
        });
        break;
      }
      default:
        console.log(
          `[admin] #${sub.getProcessed()} ignoring request for ${m.subject}`
        );
    }
  }
  console.log(`subscription ${sub.getSubject()} drained.`);
})(msub);

// wait for the client to close here.
await nc.closed().then((err) => {
  let m = `connection to ${nc.getServer()} closed`;
  if (err) {
    m = `${m} with an error: ${err.message}`;
  }
  console.log(m);
});
