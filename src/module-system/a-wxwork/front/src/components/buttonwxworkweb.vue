<template>
  <eb-button :onPerform="onPerformSignIn"><img src="../assets/img/wxwork-48.png"></eb-button>
</template>
<script>
const urlLogin = '/api/a/wxwork/passport/a-wxwork/wxworkweb';
export default {
  meta: {
    global: false,
    async disable({ ctx, state }) {
      // jwt
      if (ctx.$meta.config.base.jwt) return true;
      // only pc
      if (ctx.$device.iphone || ctx.$device.android || ctx.$device.wxwork || ctx.$device.wechat) {
        return true;
      }
      return false;
    },
    login({ ctx, state, hash }) {
      ctx.$meta.vueApp.toLogin({ url: urlLogin, state, hash });
    },
  },
  data() {
    return {};
  },
  methods: {
    onPerformSignIn() {
      this.$options.meta.login({ ctx: this });
    },
  },
};

</script>
<style scoped>
</style>
