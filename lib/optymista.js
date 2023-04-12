const util = require('node:util');
const { help } = require("./help");
const { fluid } = require("./fluid");
const path = require('node:path');

module.exports = optymista;

function optymista(processArgs = process.argv.slice(2)) {
  let _usage = [];
  let _version;
  const options = fluid({
    help: { short: 'h', type: 'boolean' }
  });

  const self = {
    boolean,
    string,
    multiple,
    default: objectify(_default),
    describe: objectify(describe),
    alias: objectify(alias),
    short: objectify(short),
    option: objectify(option),
    usage,
    version,
    showHelp,
    get argv() { return parseArgs(processArgs); }
  };
  self.options = self.option;

  return self;

  function boolean(...keys) {
    options.setAll(keys, 'type', 'boolean');
    return self;
  }

  function string(...keys) {
    options.setAll(keys, 'type', 'string');
    return self;
  }

  function multiple(...keys) {
    options.setAll(keys, 'multiple', true);
    return self;
  }

  function _default(key, value) {
    options.set(key, 'default', value);
  }

  function alias(x, y) {
    short(y, x);
  }

  function short(key, value) {
    options.set(key, 'short', value);
  }

  function describe(key, descr) {
    options.set(key, 'description', descr);
    options.soft(key, 'type', 'boolean');
  }

  function option(key, opt) {
    if (opt.boolean || opt.type === 'boolean') boolean(key);
    if (opt.string || opt.type === 'string') string(key);
    if (opt.multiple) multiple(key);
    short(key, opt.short);
    _default(key, opt.default);
    describe(key, opt.describe || opt.description || opt.desc);
  }

  function usage(...msg) {
    _usage.push(...msg);
    return self;
  }

  function version(v = true) {
    _version = v;
    return self.boolean('version')
      .short('V')
      .describe('show version and exit');
  }

  function fail(msg) {
    showHelp();
    if (msg) console.error(msg);
    process.exit(1);
  }

  function showHelp(fn = console.log) {
    fn(help(_usage, options.data));
  }

  function parseArgs(args) {
    try {
      const { values, positionals } = util.parseArgs({
        args,
        allowPositionals: true,
        options: options.data,
      });
      if (values.help) {
        showHelp();
        process.exit();
      }
      if (_version && values.version) {
        showVersion(_version);
        process.exit();
      }
      return {
        ...values,
        _: positionals
      };
    }
    catch (err) {
      fail(err.message);
    }
  }

  function objectify(fn) {
    return function (key, value) {
      if (typeof key === 'object') {
        Object.entries(key).forEach(e => fn(...e));
      }
      else {
        if (value === undefined) {
          value = key;
          key = undefined;
        }
        fn(key, value);
      }
      return self;
    };
  }
}

function showVersion(version) {
  if (typeof version !== 'string') {
    try {
      const dir = module.parent.parent.path;
      const packageJsonFile = path.join(dir, 'package.json');
      version = require(packageJsonFile).version;
    } catch {
      version = 'unknown';
    }
  }
  console.log(version);
}
