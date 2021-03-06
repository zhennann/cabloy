const versionManager = require('./bean/version.manager.js');
const atomPurchaseOrder = require('./bean/atom.purchaseOrder.js');
const flowServiceTest = require('./bean/flow.service.test.js');
const flowServiceStartEventTimer = require('./bean/flow.service.startEventTimer.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.purchaseOrder': {
      mode: 'app',
      bean: atomPurchaseOrder,
    },
    // flow
    'flow.service.test': {
      mode: 'ctx',
      bean: flowServiceTest,
    },
    'flow.service.startEventTimer': {
      mode: 'ctx',
      bean: flowServiceStartEventTimer,
    },
  };
  return beans;
};
