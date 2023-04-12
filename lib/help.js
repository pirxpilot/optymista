module.exports = {
  help
};

function help(usage, options = {}) {
  const keys = Object.keys(options)
    .filter(key => key !== 'help');

  const help = keys.length ? ['Options:'] : [];

  if (usage?.length > 0) {
    help.unshift(...usage, '');
  }

  const switches = Object.fromEntries(
    keys.map(key => makeSwitch(key, options[key]))
  );

  const pad = {
    switch: 1 + maxLen(Object.values(switches)),
    description: maxLen(Object.values(options).map(o => o.description))
  };

  keys.forEach(key => {
    const kswitch = switches[key];
    const { description = '' } = options[key];

    const body = [
      kswitch.padEnd(pad.switch),
      description.padEnd(pad.description),
      ('default' in options[key]) ?
        `[default: ${JSON.stringify(options[key].default)}]` :
        null
    ].filter(Boolean).join(' ').trimEnd();

    help.push('  ' + body);
  });

  help.push('');
  return help.join('\n');
}

function makeSwitch(key, { short, type }) {
  let str = [
    short,
    key,
  ].filter(Boolean).map(optionize).join(', ');
  if (!short && key.length > 1) {
    str = '    ' + str;
  }
  if (type === 'string') {
    str += ` <${key}>`;
  }
  return [key, str];
}

function maxLen(xs) {
  return Math.max(...xs.map(({ length = 0 } = {}) => length));
}

function optionize(sw) {
  return (sw.length > 1 ? '--' : '-') + sw;
}

