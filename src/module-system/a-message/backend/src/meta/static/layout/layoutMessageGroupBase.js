module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'list',
          medium: 'list',
          large: 'list',
        },
      },
    },
    layouts: {
      base: {
        blocks: {},
      },
      list: {
        options: {
          dataProvider: {
            providerName: 'all',
            autoInit: true,
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutMessageGroupBase',
    atomRevision: 1,
    description: '',
    layoutTypeCode: 7,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
