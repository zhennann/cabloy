<template>
  <eb-link-color :class="buttonClass" :iconMaterial="buttonIcon" :text="buttonLabel" :onPerform="onPerformClick"
     :stats_params="{module: 'a-user',name: 'user'}"
  ></eb-link-color>
</template>
<script>
// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutmobile').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ ebLayoutButtonBase ],
    data() {
      return {
      };
    },
    mounted() {
      this._checkSpecialPath();
    },
    created() {
      this.$meta.eventHub.$on('mine:open', this.onMineOpen);
    },
    beforeDestroy() {
      this.$meta.eventHub.$off('mine:open', this.onMineOpen);
    },
    methods: {
      onMineOpen() {
        this.onPerformClick();
      },
      _checkSpecialPath() {
        const query = this.$utils.parseUrlQuery();
        const path = query && query.__to;
        if (!path) return false;
        if (path === 'mine') {
          this.onPerformClick();
        }
      },
    },
  };
}

</script>
