const schemas = require('./meta/validation/schemas.js');
// static
const staticApps = require('./meta/static/apps.js');
const staticFlowDefs = require('./meta/static/flowDefs.js');
const staticResources = require('./meta/static/resources.js');
// meta
const meta = {
  base: {
    atoms: {
      document: {
        info: {
          bean: 'document',
          title: 'Document',
          tableName: '',
          language: true,
          category: true,
          tag: true,
          cms: true,
          flow: {
            stage: 'draft',
          },
          fields: {
            dicts: {
              atomState: {
                draft: {
                  dictKey: null,
                },
              },
            },
          },
        },
        actions: {
          preview: {
            code: 101,
            title: 'Preview',
            actionModule: 'a-cms',
            actionComponent: 'action',
            icon: { f7: '::preview' },
            enableOnStatic: null,
            enableOnOpened: null,
            stage: 'draft,formal',
          },
        },
        validator: 'document',
        search: {
          validator: 'documentSearch',
        },
      },
    },
    statics: {
      'a-app.app': {
        items: staticApps,
      },
      'a-flow.flowDef': {
        items: staticFlowDefs,
      },
      'a-base.resource': {
        items: staticResources,
      },
    },
  },
  validation: {
    validators: {},
    keywords: {},
    schemas,
  },
};
module.exports = meta;
