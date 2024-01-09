import { connect, StringCodec } from 'nats';

const nc = await connect({ servers: 'nats://127.0.0.1:4222' });
const sc = StringCodec();

// subscriptions can have wildcard subjects
// the '*' matches any string in the specified token position
const s1 = nc.subscribe('help.*.system');
const s2 = nc.subscribe('help.me.*');
// the '>' matches any tokens in that position or following
// '>' can only be specified at the end of the subject
const s3 = nc.subscribe('help.>');

async function printMsgs(s) {
  let subj = s.getSubject();
  console.log(`listening for ${subj}`);
  const c = 13 - subj.length;
  const pad = ''.padEnd(c);
  for await (const m of s) {
    console.log(
      `[${subj}]${pad} #${s.getProcessed()} - ${m.subject} ${
        m.data ? ' ' + sc.decode(m.data) : ''
      }`
    );
  }
}

printMsgs(s1);
printMsgs(s2);
printMsgs(s3);

nc.publish('help.me.system', sc.encode('world'));
nc.publish('help.me.again', sc.encode('again'));
nc.publish('help.again', sc.encode('again'));

// don't exit until the client closes
await nc.closed();

/** Output:
listening for help.*.system
listening for help.me.*
listening for help.>
[help.>]        #1 - help.me.system  world
[help.*.system] #1 - help.me.system  world
[help.me.*]     #1 - help.me.system  world
[help.>]        #2 - help.me.again  again
[help.me.*]     #2 - help.me.again  again
[help.>]        #3 - help.again  again 
*/
