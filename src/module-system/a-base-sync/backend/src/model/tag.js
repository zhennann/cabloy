module.exports = app => {
  class Tag extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aTag', options: { disableDeleted: false } });
    }
  }
  return Tag;
};
