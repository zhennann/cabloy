<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Mail')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link ref="buttonSubmit" iconMaterial="send" :onPerform="onPerformSend"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-list v-if="item" form inline-labels no-hairlines-md @submit="onFormSubmit">
      <eb-list-input :label="$text('MailTo')" type="text" clear-button :placeholder="$text('MailTo')" v-model="item.to"></eb-list-input>
      <eb-list-input :label="$text('Subject')" type="text" clear-button :placeholder="$text('Subject')" v-model="item.subject"></eb-list-input>
      <eb-list-input :label="$text('Text')" type="text" clear-button :placeholder="$text('Text')" v-model="item.text"></eb-list-input>
    </eb-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      item: {
        to: 'test@cabloy.com',
        subject: 'this is a test',
        text: 'message body!',
      },
    };
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    onPerformSend() {
      return this.$api.post('test/feat/sendMail', {
        data: this.item,
      }).then(() => {
        return true;
      });
    },
  },
};

</script>
<style lang="less" scoped>
</style>
