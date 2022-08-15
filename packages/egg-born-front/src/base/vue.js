import Vue from 'vue';
import DevInfo from './plugin/devInfo.js';

if (process.env.NODE_ENV === 'production') {
  Vue.config.productionTip = false;
}

// Vue
// eslint-disable-next-line
window.Vue = Vue;

// meta
const strats = Vue.config.optionMergeStrategies;
strats.meta = function (parentVal, childVal /* , vm, key */) {
  return Vue.prototype.$meta.util.extend({}, childVal, parentVal);
};

// plugin: DevInfo
if (process.env.NODE_ENV === 'development') {
  Vue.use(DevInfo);
}

export default Vue;
