<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Settings')" eb-back-link="Back"> </eb-navbar>
    <f7-list v-if="ready">
      <eb-list-item
        class="item"
        v-for="item of items"
        :key="item.module"
        :title="getModule(item.module).titleLocale"
        link="#"
        :context="item"
        :onPerform="onItemClick"
      >
      </eb-list-item>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="true"></eb-load-more>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      scene: this.$f7route.params.scene,
      items: null,
    };
  },
  computed: {
    ready() {
      return this.modulesAll && this.items;
    },
  },
  methods: {
    onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore(/* { index }*/) {
      // fetch
      return this.$api.post(`settings/${this.scene}/list`).then(data => {
        this.items = this.items.concat(data.list);
        return data;
      });
    },
    onItemClick(event, item) {
      let action;
      if (item.validator) {
        action = {
          actionModule: 'a-settings',
          actionPath: `${this.scene}/edit?module=${item.module}`,
        };
      } else {
        action = item;
      }
      return this.$meta.util.performAction({ ctx: this, action, item }).then(() => {
        return;
      });
    },
  },
};
</script>
