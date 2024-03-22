import { connect, StringCodec, } from 'nats';
import { parseFlags } from './argparser.js';
// create a codec
const sc = StringCodec();
let flags = parseFlags(process.argv.slice(2), usage, ['max']);
let opts = {};
opts.servers = flags.server;
function usage() {
    console.log('subscriber [-s <server>] [-max <count>] <subject>');
    process.exit(-1);
}
async function main() {
    let nc = await connect(opts);
    // if user specifies a max, auto-unsubscribe when the count is reached
    let max = flags.options['max'] || -1;
    max = parseInt(max.toString(), 10);
    let subopts = {};
    if (max > 0) {
        subopts.max = max;
    }
    subopts.callback = (err, msg) => {
        count++;
        if (err) {
            console.error(`[#${count}] error processing message [${err.message} - ${msg}`);
            return;
        }
        if (msg.reply) {
            console.log(`[#${count}] received request on [${msg.subject}]: ${msg.data} respond to ${msg.reply}`);
        }
        else {
            console.log(`[#${count}] received on [${msg.subject}]: ${msg.data}`);
        }
    };
    // create the subscription var
    let count = 0;
    nc.subscribe(flags.subject, subopts);
    nc.flush().then(() => console.log(`listening to [${flags.subject}]`));
}
main();
