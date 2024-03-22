import { connect } from 'nats';
import { parseFlags } from './argparser.js';
const usage = () => {
    console.log('client [-s <server>] <subject> <payload>');
    process.exit(-1);
};
let flags = parseFlags(process.argv.slice(2), usage, []);
let opts = {};
opts.servers = flags.server;
const main = async () => {
    let nc = await connect(opts);
    // make the request
    nc.request(flags.subject, flags.payload)
        .then((msg) => {
        console.log(`received response ${msg.data}`);
        nc.close();
    })
        .catch((err) => {
        console.log(`error sending request to [${flags.subject}]: ${err}`);
        nc.close();
    });
    console.log(`waiting for response to [${flags.subject}]`);
};
main();
