import { connect, createInbox, Empty, headers } from 'nats';

const nc = await connect({
  servers: `demo.nats.io`,
});

const subj = createInbox();
const sub = nc.subscribe(subj);
(async () => {
  for await (const m of sub) {
    if (m.headers) {
      for (const [key, value] of m.headers) {
        console.log(`${key}=${value}`);
      }
      // reading/setting a header is not case sensitive
      console.log('id', m.headers.get('id'));
    }
  }
})().then();

const h = headers();
h.append('id', '123456');
h.append('unix_time', Date.now().toString());
nc.publish(subj, Empty, { headers: h });

await nc.flush();
await nc.close();
