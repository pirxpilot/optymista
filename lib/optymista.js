const util = require('node:util');
const { help } = require("./help");
const { fluid } = require("./fluid");

module.exports = optymista;

function optymista(processArgs = process.argv.slice(2)) {
  let usage;
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
    usage: _usage,
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

  function _usage(...msg) {
    usage = msg;
    return self;
  }

  function fail(msg) {
    showHelp();
    if (msg) console.error(msg);
    process.exit(1);
  }

  function showHelp(fn = console.log) {
    fn(help(usage, options.data));
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