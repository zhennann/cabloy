module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    toolbar: {
      buttons: [
        { module: 'a-layoutmobile', name: 'buttonAppHome' },
        { module: 'a-layoutmobile', name: 'buttonSearch' },
        { module: 'a-layoutmobile', name: 'buttonMine' },
      ],
    },
  };
  const layout = {
    atomName: 'Mobile Layout(Authenticated)',
    atomStaticKey: 'layoutMobile',
    atomRevision: 5,
    description: '',
    layoutTypeCode: 1,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
