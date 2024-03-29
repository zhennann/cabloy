export default {
  methods: {
    _patchItemsClassNameStyle({ context, items }) {
      for (const item of items) {
        this._patchItemClassNameStyle({ context, item });
      }
    },
    _patchItemClassNameStyle({ context, item }) {
      if (!item) return;
      const { property } = context;
      if (property.ebType === 'group' || property.ebType === 'group-flatten') return;
      // use <tag staticClass="xxx"> as the default value, so as to override the grid-col rules
      //    use <tag class="xxx"> to support extend rules
      const staticClassOriginal = item.data.staticClass;
      const staticClass = this._getStaticClass({ context, staticClassDefault: staticClassOriginal });
      const className = this._getClassName({ context });
      const cssStyle = this._getCssStyle({ context });
      const items = Array.isArray(item) ? item : [item];
      for (item of items) {
        if (staticClass && staticClass !== staticClassOriginal) {
          // hold the original item.data.staticClass
          item.data.staticClass = this.$vuef7.utils.classNames(staticClassOriginal, staticClass);
          // item.data.staticClass = className;
        }
        if (className) {
          if (item.data.class) {
            item.data.class = this.$vuef7.utils.classNames(item.data.class, className);
          } else {
            item.data.class = className;
          }
        }
        if (cssStyle) {
          if (item.data.style) {
            item.data.style = this.$meta.util.extend({}, item.data.style, cssStyle);
          } else {
            item.data.style = cssStyle;
          }
        }
      }
    },
    _getClassName({ context }) {
      const params = context.getParams();
      return params.className;
    },
    _getCssStyle({ context }) {
      const params = context.getParams();
      return params.cssStyle;
    },
    _getStaticClass({ context, staticClassDefault }) {
      const params = context.getParams();
      const staticClass = params.staticClass;
      if (staticClass !== undefined) return staticClass;
      if (staticClassDefault !== undefined) return staticClassDefault;
      return this._getStaticClassDefault({ context });
    },
    _getStaticClassDefault({ context }) {
      const paramsDefault = context.getParamsDefault();
      return paramsDefault.staticClass;
    },
  },
};
