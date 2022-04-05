module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassRole = {
    module: moduleInfo.relativeName,
    atomClassName: 'role',
  };
  const __atomClassUser = {
    module: moduleInfo.relativeName,
    atomClassName: 'user',
  };
  class VersionUpdate14 {
    get modelRole() {
      return ctx.model.role;
    }
    get modelUser() {
      return ctx.model.user;
    }

    async run(options) {
      // adjustRoles
      await this._adjustRoles(options);
      // adjustUsers
      await this._adjustUsers(options);
    }

    async _adjustRoles(options) {
      // all instances
      const instances = await ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await ctx.meta.util.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: 'update14_adjustRoles',
        });
      }
    }

    async _adjustUsers(options) {
      // all instances
      const instances = await ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await ctx.meta.util.executeBean({
          subdomain: instance.name,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.version.manager`,
          context: options,
          fn: 'update14_adjustUsers',
        });
      }
    }

    async _adjustRolesInstance() {
      // select all roles where atomId=0
      const roles = await this.modelRole.select({ where: { atomId: 0 } });
      for (const role of roles) {
        const roleId = role.id;
        const roleName = role.roleName;
        // add atom
        const atomKey = await ctx.bean.atom.create({
          atomClass: __atomClassRole,
          item: {
            itemId: roleId,
            atomStaticKey: `${moduleInfo.relativeName}:role_${roleName}`,
            catalog: role.catalog,
            system: role.system,
            roleIdParent: role.roleIdParent,
          },
          user: { id: 0 },
        });
        await ctx.bean.atom.write({
          key: atomKey,
          item: {
            atomName: roleName,
          },
          user: { id: 0 },
        });
        // submit
        await ctx.bean.atom.submit({
          key: atomKey,
          options: { ignoreFlow: true },
          user: { id: 0 },
        });
      }
    }

    async _adjustUsersInstance() {
      // select all roles where atomId=0
      const items = await this.modelUserRole.select({ where: { atomId: 0 } });
      for (const item of items) {
        const userId = item.id;
        // add atom
        const atomKey = await ctx.bean.atom.create({
          atomClass: __atomClassUser,
          item: {
            itemId: userId,
          },
          user: { id: 0 },
        });
        // submit
        await ctx.bean.atom.submit({
          key: atomKey,
          options: { ignoreFlow: true },
          user: { id: 0 },
        });
      }
    }
  }

  return VersionUpdate14;
};
