const strategy = require('./strategy.js');
module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const provider = moduleInfo.name;
  async function verify(ctx, body) {
    const { auth, password, rememberMe } = body.data;
    // validate
    await ctx.bean.validation.validate({ validator: 'signin', data: body.data });
    // exists
    const user = await ctx.bean.user.exists({ userName: auth, email: auth, mobile: auth });
    if (!user) return ctx.throw(1001);
    // disabled
    if (user.disabled) return ctx.throw(1002);
    // verify
    const authSimple = await ctx.service.auth.verify({ userId: user.id, password });
    if (!authSimple) return ctx.throw(1001);
    return {
      module: moduleInfo.relativeName,
      provider,
      profileId: authSimple.id,
      maxAge: rememberMe ? null : 0,
      authShouldExists: true,
      profile: {
        authSimpleId: authSimple.id,
        rememberMe,
      },
    };
  }
  return {
    providers: {
      [provider]: {
        meta: {
          title: 'User/Password',
          inline: true,
          mode: 'direct',
          component: 'signin',
        },
        config: {
        },
        handler: app => {
          return {
            strategy,
            callback: (req, body, done) => {
              verify(req.ctx, body).then(user => {
                app.passport.doVerify(req, user, done);
              }).catch(err => { done(err); });
            },
          };
        },
      },
    },
  };
};
