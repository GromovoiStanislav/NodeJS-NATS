export function parseFlags(args, usage, flags) {
    let p = new ArgParser(args, usage, flags);
    return p.parseFlags();
}
class ArgParser {
    args;
    usage;
    flags;
    constructor(args, usage, flags) {
        this.args = args;
        this.usage = usage;
        this.flags = flags;
    }
    getOpt(flag) {
        let si = this.args.indexOf(flag);
        if (si !== -1) {
            let v = this.args[si + 1];
            this.args.splice(si, 2);
            return v;
        }
        return undefined;
    }
    parseFlags() {
        let opts = {};
        opts.server = this.getOpt('-s');
        if (this.flags) {
            opts.options = {};
            this.flags.forEach((f) => {
                let v = this.getOpt('-' + f);
                if (v) {
                    opts.options[f] = v;
                }
            });
        }
        // should have one or two elements left
        if (this.args.length < 1) {
            this.usage();
        }
        opts.subject = this.args[0] || '';
        opts.payload = this.args[1] || '';
        return opts;
    }
}
