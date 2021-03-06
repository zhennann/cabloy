// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // broadcasts
  config.broadcasts = {
    memRemove: {
      bean: 'memRemove',
    },
    memClear: {
      bean: 'memClear',
    },
  };

  // db
  config.db = {
    redis: true,
  };

  return config;
};
