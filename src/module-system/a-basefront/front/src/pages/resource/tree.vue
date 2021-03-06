<template>
  <eb-page>
    <eb-navbar :title="pageTitle" eb-back-link="Back"></eb-navbar>
    <eb-treeview v-if="ready" ref="tree" :root="root" :onLoadChildren="onLoadChildren" :onNodePerform="onNodePerform">
    </eb-treeview>
    <f7-block></f7-block>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
export default {
  mixins: [ ebAtomActions ],
  data() {
    const query = this.$f7route.query;
    const maxLevelAutoOpened = parseInt(query.maxLevelAutoOpened || 1);
    let resourceType = query.resourceType;
    let home = false;
    if (!resourceType) {
      resourceType = 'a-base:menu';
      home = true;
    }
    return {
      maxLevelAutoOpened,
      resourceType,
      home,
      treeData: null,
      resourcesArrayAll: null,
      root: {
        attrs: {
          itemToggle: false,
          selectable: true,
        },
      },
    };
  },
  computed: {
    ready() {
      return this.treeData && this.resourcesArrayAll && this.actionsAll;
    },
    pageTitle() {
      if (this.home) {
        const inPanel = this.$view.inPanel();
        return inPanel ? this.$text('Menu') : this.$text('Home');
      }
      const resourceTypes = this.$store.getState('a/base/resourceTypes');
      if (!resourceTypes) return null;
      return resourceTypes[this.resourceType].titleLocale;
    },
  },
  created() {
    this.__init();
  },
  methods: {
    async __init() {
      this.$store.dispatch('a/base/getResourceTypes');
      this.resourcesArrayAll = await this.$store.dispatch('a/base/getResourcesArray', { resourceType: this.resourceType });
      this.treeData = await this.$store.dispatch('a/base/getResourceTrees', { resourceType: this.resourceType });
    },
    combineAtomClassAndLanguage() {
      const queries = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
      };
      if (this.language) {
        queries.language = this.language;
      }
      return queries;
    },
    async _loadNodeCategories(node) {
      const levelCurrent = (node.data && node.data.__level) || 0;
      const level = levelCurrent + 1;
      let treeChildren;
      if (node.root) {
        treeChildren = this.treeData;
      } else {
        treeChildren = node.data.children;
      }
      const list = [];
      for (const item of treeChildren) {
        const node = {
          id: item.id,
          attrs: {
            // link: '#',
            label: item.categoryNameLocale,
            toggle: true,
            itemToggle: true,
            loadChildren: true,
          },
          data: {
            ...item,
            __level: level,
          },
        };
        if (level <= this.maxLevelAutoOpened || this.maxLevelAutoOpened === -1) {
          const children = await this.onLoadChildren(node);
          this.$refs.tree.childrenLoaded(node, children);
          node.attrs.loadChildren = false;
          node.attrs.opened = true;
        }
        list.push(node);
      }
      return list;
    },
    async _loadNodeResources(node) {
      const resources = this.resourcesArrayAll.filter(item => item.atomCategoryId === node.id);
      return resources.map(item => {
        const node = {
          id: item.atomId,
          attrs: {
            link: '#',
            label: item.atomNameLocale,
            toggle: false,
            loadChildren: false,
          },
          data: item,
        };
        return node;
      });
    },
    async onLoadChildren(node) {
      if (node.root || node.data.categoryCatalog === 1) {
        return await this._loadNodeCategories(node);
      }
      return await this._loadNodeResources(node);
    },
    onNodePerform(event, context, node) {
      const resourceConfig = JSON.parse(node.data.resourceConfig);
      // special for action
      let action;
      let item;
      if (resourceConfig.atomAction === 'create') {
        //
        action = this.getAction({
          module: resourceConfig.module,
          atomClassName: resourceConfig.atomClassName,
          name: resourceConfig.atomAction,
        });
        item = {
          module: resourceConfig.module,
          atomClassName: resourceConfig.atomClassName,
        };
      } else if (resourceConfig.atomAction === 'read') {
        if (!resourceConfig.actionComponent && !resourceConfig.actionPath) {
          resourceConfig.actionPath = '/a/basefront/atom/list?module={{module}}&atomClassName={{atomClassName}}';
        }
        action = resourceConfig;
        item = {
          module: resourceConfig.module,
          atomClassName: resourceConfig.atomClassName,
        };
      } else {
        action = resourceConfig;
      }
      action = this.$utils.extend({}, action, { targetEl: event.target });
      return this.$meta.util.performAction({ ctx: this, action, item });
    },
  },
};

</script>
<style lang="less" scoped>

</style>
