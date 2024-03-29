let Vue;

import './assets/css/module.css';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  return cb({
    routes: require('./routes.js').default,
    stores: require('./stores.js').default,
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
  });
}

// export
export default {
  install,
};
