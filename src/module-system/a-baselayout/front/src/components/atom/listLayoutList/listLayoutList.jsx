export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layoutConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    // eslint-disable-next-line
    this.layoutManager.layout.instance = null;
  },
  methods: {
    async init() {
      // eslint-disable-next-line
      this.layoutManager.layout.instance = this;
      // subnavbar
      this.layoutManager.subnavbar_policyDefault();
      // provider switch
      await this.layoutManager.data_providerSwitch({
        providerName: 'continuous',
        autoInit: this.layoutManager.container.scene !== 'search',
      });
    },
  },
  render() {
    return (
      <div>
        {this.layoutManager.layout_renderBlock({ blockName: 'items' })}
        {this.layoutManager.data_renderLoadMore()}
      </div>
    );
  },
};
