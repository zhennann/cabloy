// const moduleInfo = module.info;

const schemas = {};
// activityService
schemas.activityService = {
  type: 'object',
  properties: {
    bean: {
      type: 'object',
      ebType: 'component',
      ebTitle: 'Bean',
      ebRender: {
        module: 'a-flowchart',
        name: 'renderBeanFlowService',
      },
      notEmpty: true,
    },
    parameterExpression: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Parameter Expression',
      ebParams: {
        textarea: true,
      },
    },
  },
};
module.exports = schemas;
