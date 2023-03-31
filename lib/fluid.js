module.exports = {
  fluid
};

function fluid(data) {
  let _lastKey;

  const self = {
    set,
    setAll,
    soft,
    get data() { return data; }
  };
  return self;

  function setAll(keys, k, v) {
    if (keys.length === 0 && _lastKey) {
      opt(_lastKey).set(k, v);
    } else {
      keys.forEach(key => opt(key).set(k, v));
    }
    return self;
  }

  function set(key, k, v) {
    opt(key).set(k, v);
    return self;
  }

  function soft(key, k, v) {
    opt(key).soft(k, v);
    return self;
  }

  function opt(key = _lastKey) {
    let o = data[key];
    _lastKey = key;
    const self = {
      set,
      soft
    };
    return self;

    function set(k, v) {
      if (v === undefined) return self;
      if (!o) data[key] = o = {};
      o[k] = v;
      return self;
    }

    function soft(k, v) {
      return (o && k in o) ? self : set(k, v);
    }
  }
}
