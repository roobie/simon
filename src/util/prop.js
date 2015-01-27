function gettersetter(store) {
  var prop = function() {
    if (arguments.length) store = arguments[0];
    return store;
  };
  prop.toJSON = function() {
    return store;
  };
  return prop;
}

function prop(store) {
  // note: using non-strict equality check here because
  // we're checking if store is null OR undefined
  return gettersetter(store);
};

module.exports = prop;
