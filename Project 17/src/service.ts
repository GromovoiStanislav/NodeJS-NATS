import { connect, ConnectionOptions } from 'nats';
import { parseFlags } from './argparser.js';

const usage = () => {
  console.log('service [-s <server>] <subject> <payload>');
  process.exit(-1);
};

let flags = parseFlags(process.argv.slice(2), usage, []);
let opts = {} as ConnectionOptions;

opts.servers = flags.server;

const main = async () => {
  let nc = await connect(opts);

  // create the subscription
  let count = 0;
  nc.subscribe(flags.subject, {
    callback: (err, msg) => {
      if (err) {
        console.error(
          `[#${count}] error processing message [${err.message} - ${msg}`
        );
        return;
      }
      if (msg.reply) {
        count++;
        console.log(
          `[#${count}] received request - responding to ${msg.reply}`
        );
        nc.publish(msg.reply, flags.payload);
      }
    },
  });

  nc.flush().then(() => console.log(`listening to [${flags.subject}]`));
};

main();
