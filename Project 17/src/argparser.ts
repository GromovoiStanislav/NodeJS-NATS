export interface Flags {
  server?: string;
  subject: string;
  payload: any;
  options: { [key: string]: string };
}

export function parseFlags(
  args: string[],
  usage: Function,
  flags: string[]
): Flags {
  let p = new ArgParser(args, usage, flags);
  return p.parseFlags();
}

class ArgParser {
  args: string[];
  usage: Function;
  flags?: string[];

  constructor(args: string[], usage: Function, flags: string[]) {
    this.args = args;
    this.usage = usage;
    this.flags = flags;
  }

  getOpt(flag: string): string | undefined {
    let si = this.args.indexOf(flag);
    if (si !== -1) {
      let v = this.args[si + 1];
      this.args.splice(si, 2);
      return v;
    }
    return undefined;
  }

  parseFlags(): Flags {
    let opts = {} as Flags;
    opts.server = this.getOpt('-s');

    if (this.flags) {
      opts.options = {} as { [key: string]: string };
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
