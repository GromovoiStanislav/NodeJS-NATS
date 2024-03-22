import { connect, StringCodec } from 'nats';
import { parseFlags } from './argparser.js';
// create a codec
const sc = StringCodec();
const usage = () => {
    console.log('publisher -- [-s <server>] [-count <count>] <subject> <payload>');
    process.exit(-1);
};
let flags = parseFlags(process.argv.slice(2), usage, ['count']);
let opts = {};
opts.servers = flags.server;
const main = async () => {
    let nc = await connect(opts);
    let max = flags.options['count'] || 1;
    max = parseInt(max.toString(), 10);
    for (let i = 0; i < max; i++) {
        console.log('options', process.argv.slice(2));
        //nc.publish(flags.subject, sc.encode(flags.payload));
        nc.publish(flags.subject, flags.payload);
        console.log(`[#${i + 1}] published ${flags.subject} ${flags.payload || ''}`);
    }
    await nc.flush();
    await nc.close();
};
main();
