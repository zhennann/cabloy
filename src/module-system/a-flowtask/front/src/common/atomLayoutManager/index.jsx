import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Info from './info.jsx';
import Validate from './validate.jsx';
import Actions from './actions.jsx';

// container: {
//   flowTaskId,
//   mode, // edit/view
//   layout,
//   flowLayoutManager,
//   task,
//   data,
//   action,
// },

export default {
  mixins: [ Base, Page, Layout, Info, Validate, Actions ],
  data() {
    return {
    };
  },
  computed: {
    container_flowLayoutManager() {
      return this.contextParams.flowLayoutManager;
    },
    container_task() {
      return this.contextParams.task;
    },
    container_data() {
      return this.contextParams.data;
    },
    container_action() {
      return this.contextParams.action;
    },
  },
  created() {
    this.layout_prepareConfig().then(() => {
      this.base.ready = true;
    });
  },
  beforeDestroy() {
    this.layout.instance = null;
    this.$emit('layoutManager:destroy');
  },
};
