export default {
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {
      inited: false,
      info: {
        pageCurrent: 0,
        pageSize: 20,
        total: 0,
      },
      items: [],
      loading: false,
    };
  },
  beforeDestroy() {},
  methods: {
    async switch(options) {
      // only inited once
      if (this.inited) return;
      // inited
      this.inited = true;
      // init
      if (options.autoInit) {
        this.onPageRefresh();
      }
    },
    onPageRefresh(/* force*/) {
      this.onPageClear();
      this.loadDetails();
    },
    onPageInfinite() {
      // do nothing
    },
    onPageClear() {
      // items
      this.items = [];
      this.info = {
        pageCurrent: 0,
        pageSize: 20,
        total: 0,
      };
      this.loading = false;
    },
    async loadDetails() {
      this.loading = true;
      try {
        // params
        const params = this.layoutManager.base_prepareSelectParams();
        // fetch
        const res = await this.$api.post('/a/detail/detail/select', params);
        this.items = res.list;
        this.info = {
          pageCurrent: 1,
          pageSize: this.items.length,
          total: this.items.length,
        };
        this.loading = false;
        return res;
      } catch (err) {
        this.layoutManager.$view.toast.show({ text: err.message });
        this.loading = false;
      }
    },
    getItems() {
      return this.items;
    },
    getItemsAll() {
      return this.getItems();
    },
    getLoading() {
      return this.loading;
    },
    getPageInfo() {
      return this.info;
    },
    gotoPage(/* pageNum*/) {
      // do nothing
    },
    findItem(detailId) {
      const index = this.items.findIndex(item => item.detailId === detailId);
      const item = index === -1 ? null : this.items[index];
      return { pageNum: 1, items: this.items, index, item };
    },
    spliceItem(bundle, howmany, ...args) {
      if (howmany === undefined) howmany = 1;
      return bundle.items.splice(bundle.index, howmany, ...args);
    },
    replaceItem(bundle, itemNew) {
      this.$set(bundle.items, bundle.index, itemNew);
    },
  },
};
