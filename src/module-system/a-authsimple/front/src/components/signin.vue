<template>
  <div>
    <f7-card>
      <f7-card-content>
        <eb-validate ref="validate" :onPerform="onPerformValidate">
          <eb-list form no-hairlines-md @submit="onSubmit">
            <eb-list-input :label="$text('Your Username/Mobile/Email')" floating-label type="text" clear-button :placeholder="$text('Your Username/Mobile/Email')" v-model="data.auth" dataPath="auth">
              <f7-icon material="person_outline" slot="media"></f7-icon>
            </eb-list-input>
            <eb-list-input :label="$text('Your Password')" floating-label type="password" clear-button :placeholder="$text('Your Password')" v-model="data.password" dataPath="password">
              <f7-icon material="lock_outline" slot="media"></f7-icon>
            </eb-list-input>
            <eb-list-input :label="$text('Captcha Code')" floating-label type="text" clear-button :placeholder="$text('Captcha Code')" v-model="captcha.token" dataPath="captcha/token">
              <f7-icon slot="media"></f7-icon>
              <div slot="content">
                <eb-component ref="captchaContainer" module="a-captcha" name="captchaContainer" :options="captchaContainerOptions"></eb-component>
              </div>
            </eb-list-input>
            <f7-list-item :title="$text('Remember Me')">
              <f7-icon slot="media"></f7-icon>
              <eb-toggle slot="after" v-model="data.rememberMe" dataPath="rememberMe"></eb-toggle>
            </f7-list-item>
            <eb-list-button ref="buttonSubmit" :onPerform="signIn">{{$text('Sign In')}}</eb-list-button>
          </eb-list>
        </eb-validate>
      </f7-card-content>
      <f7-card-footer>
        <eb-link eb-href="/a/authsimple/passwordForgot" eb-target="_self" class="text-smaller">{{$text('Forgot Password')}}</eb-link>
        <div></div>
        <eb-link eb-href="/a/authsimple/signup" eb-target="_self" class="text-smaller">{{$text('Sign Up')}}</eb-link>
      </f7-card-footer>
    </f7-card>
  </div>
</template>
<script>
const urlLogin = '/a/authsimple/signup';
export default {
  meta: {
    global: false,
    async disable({ ctx, state }) {
      return false;
    },
    login({ ctx, state, hash }) {
      if (state === 'associate') {
        ctx.$meta.vueApp.toLogin({ url: urlLogin, state, hash });
      }
    },
  },
  props: {
    state: {
      type: String,
    },
  },
  data() {
    return {
      data: {
        auth: null,
        password: null,
        rememberMe: false,
      },
      captcha: {
        token: null,
      },
      captchaContainerOptions: {
        props: {
          module: 'a-authsimple',
          sceneName: 'signin',
        },
      },
    };
  },
  created() {},
  methods: {
    onPerformValidate() {
      return this.$api.post('auth/signin', {
        data: this.data,
        state: this.state,
        captcha: this.$refs.captchaContainer.getComponentInstance().captchaData({ token: this.captcha.token }),
      }).then(() => {
        this.$meta.vueApp.reload({ echo: true });
      });
    },
    signIn() {
      return this.$refs.validate.perform();
    },
    onSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
  },
};

</script>
<style lang="less" scoped>
.text-smaller {
  font-size: smaller !important;
}

</style>
