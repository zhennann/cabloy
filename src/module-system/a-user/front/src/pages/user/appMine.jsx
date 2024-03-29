import appMineLayoutManager from '../../common/appMineLayoutManager/index.jsx';
export default {
  mixins: [appMineLayoutManager],
  data() {
    const query = this.$f7route.query;
    const layout = query.layout;
    return {
      container: {
        layout,
      },
    };
  },
  render() {
    return this.layout_renderPage();
  },
};
