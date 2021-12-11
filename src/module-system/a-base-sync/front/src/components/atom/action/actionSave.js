export default {
  methods: {
    async _onActionSave() {
      const { ctx, action, item } = this.$props;
      // onActionSaveBefore
      //   ctx maybe not layoutManager
      if (ctx.layout && ctx.layout.instanceExtend && ctx.layout.instanceExtend.onActionSaveBefore) {
        await ctx.layout.instanceExtend.onActionSaveBefore(this.$props);
      }
      // write
      const key = { atomId: item.atomId, itemId: item.itemId };
      await ctx.$api.post('/a/base/atom/write', { key, item });
      ctx.$meta.eventHub.$emit('atom:action', { key, action, actionSource: ctx });
      // toast
      return ctx.$text('Saved');
    },
  },
};
