<script>
import TabViews from './tabViews.vue';
import Group from './group.vue';

import Vue from 'vue';
export default {
  meta: {
    global: false,
  },
  components: {
    ebTabViews: TabViews,
    ebGroup: Group,
  },
  render(c) {
    // children
    const children = [];

    // tab views
    if (this.tabShowed) {
      children.push(c('eb-tab-views', {
        key: 'tabViews', ref: 'tabViews',
        props: {
          toolbarConfig: this.layoutConfig.toolbar,
        },
      }));
    }

    // group
    children.push(c('eb-group', { key: 'group', ref: 'group' }));

    // ready
    return c('div', { staticClass: 'eb-layout-container eb-layout-container-mobile' }, children);
  },
  data() {
    return {
      started: false,
      toolbarInited: false,
      tabShowed: false,
      sizeExtent: null,
      size: null,
      layoutDefault: null,
      layoutScene: null,
      layoutConfig: null,
      buttonsAll: null,
    };
  },
  created() {},
  mounted() {
    this.$f7ready(() => {
      this.__init().then(() => {
        this.$nextTick(() => {
          // start
          this.start();
        });
      });
    });
  },
  methods: {
    onResize() {
      if (!this.started) return;
      this.setSize();
    },
    setSize() {
      const width = this.$$(this.$el).width();
      const height = this.$$(this.$el).height();

      // sizeExtent
      this.sizeExtent = { width, height };

      // size
      if (width <= this.layoutConfig.size.small * 2) {
        this.size = 'small';
      } else if (width > this.layoutConfig.size.small * 3) {
        this.size = 'large';
      } else {
        this.size = 'medium';
      }
    },
    start() {
      // size
      this.setSize();
      // loginOnStart
      const vueApp = this.$meta.vueApp;
      if (vueApp.checkIfNeedOpenLogin()) {
        // open view login
        this.openLogin();
      } else {
        const hashInit = vueApp.popupHashInit();
        if (hashInit) {
          this.navigate(hashInit);
        } else {
          if (!this._checkSpecialPath()) {
            this.openHome();
          }
        }
      }
      // started
      this.$nextTick(() => {
        this.started = true;
      });
    },
    _checkSpecialPath() {
      const query = this.$utils.parseUrlQuery();
      const path = query && query.__to;
      if (!path) return false;
      return false;
    },
    openMine() {
      this.$meta.eventHub.$emit('mine:open');
    },
    openHome() {
      this.tabShowed = true;
    },
    navigate(url, options) {
      if (!url) return;
      // check if http
      if (url.indexOf('https://') === 0 || url.indexOf('http://') === 0) {
        return location.assign(url);
      }
      options = options || {};
      const ctx = options.ctx;
      const target = options.target;
      const scene = options.scene;
      if (target === '_self') {
        ctx.$view.f7View.router.navigate(url, options);
      } else {
        // view
        const $viewEl = ctx && ctx.$view && this.$$(ctx.$view.$el);
        // check if target===_view or in views
        if (!$viewEl || target === '_view' || scene === 'sidebar' || $viewEl.parents('.eb-layout-scene').length > 0) {
          // in new view
          this.$refs.group.createView({ ctx, url }).then(res => {
            if (res) {
              if (res.options) options = this.$utils.extend({}, options, res.options);
              res.view.f7View.router.navigate(url, options);
            }
          });
        } else {
          // in current view
          ctx.$view.f7View.router.navigate(url, options);
        }
      }
    },
    openLogin(routeTo, options) {
      this.$meta.vueApp.openLogin(routeTo, options);
    },
    closeView(view) {
      this.$refs.group.closeView(view);
    },
    backLink(ctx) {
      let backLink = false;
      const routeDiff = this.$meta.util.viewRouterDid(ctx.$view) ? 2 : 1;
      if (!this.$meta.util.historyUrlEmpty(ctx.$f7router.history[ctx.$f7router.history.length - routeDiff])) {
        backLink = true;
      } else {
        const $el = ctx.$$(ctx.$el);
        const $view = $el.parents('.eb-layout-view');
        if ($view.length > 0) backLink = true;
      }
      return backLink;
    },
    __getResourcesAll() {
      const resourceTypes = [
        { name: 'button', var: 'buttonsAll' },
      ];
      const promises = [];
      for (const resourceType of resourceTypes) {
        promises.push(
          this.$store.dispatch('a/base/getResources', { resourceType: `a-layoutmobile:${resourceType.name}` }).then(data => {
            this[resourceType.var] = data;
          })
        );
      }
      return Promise.all(promises);
    },
    __saveLayoutConfig: Vue.prototype.$meta.util.debounce(function() {
      this.__saveLayoutConfigNow();
    }, 1000),
    __saveLayoutConfigNow() {
      // override
      const value = this.$meta.util.extend({}, this.layoutConfig);
      // remove dynamic resources
      this.__removeDynamicResources(value);
      // save
      const atomStaticKey = this.__getLayoutKey();
      this.$store.commit('a/base/setLayoutConfigKey', { module: 'a-layoutmobile', key: `layout:${atomStaticKey}`, value });
    },
    __removeDynamicResource(resources) {
      for (let index = resources.length - 1; index >= 0; index--) {
        const resource = resources[index];
        if (!resource.atomStaticKey && !resource.module) {
          resources.splice(index, 1);
        } else {
          resources[index] = resource.atomStaticKey ?
            { atomStaticKey: resource.atomStaticKey } :
            { module: resource.module, name: resource.name };
        }
      }
    },
    __removeDynamicResources(value) {
      const resources = value.toolbar.buttons;
      if (resources) {
        this.__removeDynamicResource(resources);
      }
    },
    __getLayoutKey() {
      let atomStaticKey = this.$config.layout.scene[this.$meta.config.scene];
      if (!atomStaticKey) {
        atomStaticKey = this.$config.layout.scene.web;
      }
      return atomStaticKey;
    },
    async __init() {
      const atomStaticKey = this.__getLayoutKey();
      // buttonsAll
      await this.__getResourcesAll();
      // layoutDefault
      this.layoutDefault = this.$config.layout.default;
      // layoutScene
      const _layout = await this.$api.post('/a/base/resource/read', {
        atomStaticKey,
        options: { locale: false },
      });
      this.layoutScene = JSON.parse(_layout.content);
      // layoutConfig
      const res = await this.$store.dispatch('a/base/getLayoutConfig', 'a-layoutmobile');
      // init layoutConfig
      this.__initLayoutConfig(res[`layout:${atomStaticKey}`]);
      // init toolbar
      this.__initToolbar();
      // inited
      this.toolbarInited = true;
    },
    __initLayoutConfig(layoutConfig) {
      if (layoutConfig) {
        this.layoutConfig = this.$meta.util.extend({}, this.layoutDefault, this.layoutScene, layoutConfig);
      } else {
        this.layoutConfig = this.$meta.util.extend({}, this.layoutDefault, this.layoutScene);
      }
    },
    reset() {
      this.layoutConfig = this.$meta.util.extend({}, this.layoutDefault, this.layoutScene);
      this.__saveLayoutConfigNow();
      this.$meta.vueApp.reload();
    },
    __initToolbar() {
      const buttons = this.layoutConfig.toolbar.buttons;
      if (buttons) {
        this.layoutConfig.toolbar.buttons = [];
        for (const button of buttons) {
          this.layoutConfig.toolbar.buttons.push(this._prepareButton(button));
        }
      }
    },
    _prepareButton(button) {
      // stock
      const buttonStock = this._findButtonStock(button);
      // extend
      return this.$meta.util.extend({}, buttonStock, button);
    },
    _findResourceStock(resourcesAll, resource) {
      if (!resourcesAll) return null;
      const _resource = resourcesAll[this._resourceFullName(resource)];
      if (!_resource) return null;
      return {
        ...resource,
        title: _resource.atomName,
        titleLocale: _resource.atomNameLocale,
        resourceAtomId: _resource.atomId,
        resourceConfig: JSON.parse(_resource.resourceConfig),
      };
    },
    _findButtonStock(button) {
      return this._findResourceStock(this.buttonsAll, button);
    },
    _combineViewSizeClass() {
      let sizeClass = '';
      switch (this.size) {
        case 'small':
          sizeClass = 'eb-view-size-small';
          break;
        case 'medium':
          sizeClass = 'eb-view-size-small eb-view-size-medium';
          break;
        case 'large':
          sizeClass = 'eb-view-size-small eb-view-size-medium eb-view-size-large';
          break;
        default:
          break;
      }
      return sizeClass;
    },
    _resourceFullName(resource) {
      if (resource.atomStaticKey) return resource.atomStaticKey;
      return `${resource.module}:${resource.name}`;
    },
    _buttonFullName(button) {
      return this._resourceFullName(button);
    },
    _findButton(button) {
      const _buttonIndex = this.layoutConfig.toolbar.buttons.findIndex(item => this._buttonFullName(item) === this._buttonFullName(button));
      if (_buttonIndex === -1) return [ null, -1 ];
      return [ this.layoutConfig.toolbar.buttons[_buttonIndex], _buttonIndex ];
    },
    closeButton(button) {
      const [ , _buttonIndex ] = this._findButton(button);
      if (_buttonIndex === -1) return;
      this.layoutConfig.toolbar.buttons.splice(_buttonIndex, 1);
      this.__saveLayoutConfig();
    },
    openButton(button) {
      const [ , _buttonIndex ] = this._findButton(button);
      if (_buttonIndex > -1) return;
      // prepare button
      button = this._prepareButton(button);
      this.layoutConfig.toolbar.buttons.push(button);
      this.__saveLayoutConfig();
    },
  },
};

</script>
<style scoped>
</style>
