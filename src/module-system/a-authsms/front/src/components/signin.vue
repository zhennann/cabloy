<template>
  <div>
    <f7-card>
      <f7-card-content>
        <eb-validate ref="validate" :onPerform="onPerformValidate">
          <eb-list form no-hairlines-md @submit="onSubmit">
            <eb-list-input :label="$text('Phone Number')" floating-label type="text" clear-button :placeholder="$text('Phone Number')" v-model="data.mobile" dataPath="mobile">
              <f7-icon material="call" slot="media"></f7-icon>
            </eb-list-input>
            <eb-list-input :label="$text('SMS Verification Code')" floating-label type="text" clear-button :placeholder="$text('SMS Verification Code')" v-model="captcha.token" dataPath="captcha/token">
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
        <div></div>
        <eb-link eb-href="/a/authsms/signup" eb-target="_self" class="text-smaller">{{$text('Sign Up')}}</eb-link>
      </f7-card-footer>
    </f7-card>
  </div>
</template>
<script>
const urlLogin = '/a/authsms/signup';
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
        mobile: null,
        rememberMe: false,
      },
      captcha: {
        token: null,
      },
    };
  },
  computed: {
    captchaContainerOptions() {
      return {
        props: {
          module: 'a-authsms',
          sceneName: 'signin',
          context: {
            mobile: this.data.mobile,
          },
        },
      };
    },
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
