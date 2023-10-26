import validateItem from './validateItem.jsx';
export default {
  meta: {
    global: true,
  },
  name: 'eb-validate',
  components: {
    validateItem,
  },
  render() {
    // slot
    if (!this.auto) {
      return <div>{!!this.$scopedSlots.default && this.$scopedSlots.default()}</div>;
    }
    // schema
    if (this.auto && this.ready) {
      // custom
      if (this.custom) {
        const context = {
          validate: this,
          parcel: this.parcel,
          readOnly: this.readOnly,
          onSubmit: this.onSubmit,
        };
        return (
          <eb-component
            module={this.custom.module}
            name={this.custom.name}
            options={{
              props: {
                context,
              },
            }}
          ></eb-component>
        );
      }
      // auto
      return this.renderSchema();
    }
    return <div></div>;
  },
  props: {
    host: {
      type: Object,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    auto: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
    params: {
      type: Object, // module,validator,schema
    },
    meta: {
      type: Object,
    },
    onFlush: {
      type: Function,
    },
    onReset: {
      type: Function,
    },
    onPerform: {
      type: Function,
    },
    onPerformBefore: {
      type: Function,
    },
    onPerformAfter: {
      type: Function,
    },
    dataPathRoot: {
      type: String,
      default: '/',
    },
    errors: {
      type: Array,
    },
    searchStates: {
      type: Object,
    },
  },
  data() {
    return {
      schema: null,
      verrors: null,
      vSearchStates: null,
      custom: null,
      schemaModuleName: null,
      renderModuleName: null,
      dataCopy: null,
      dataInit: null,
      callbacksPerformBefore: [],
      callbacksPerformAfter: [],
    };
  },
  computed: {
    ready() {
      return this.data && this.dataCopy && this.schema;
    },
    parcel() {
      if (!this.ready) return null;
      return {
        data: this.dataCopy,
        dataSrc: this.data,
        schema: this.schema,
        properties: this.schema.properties,
        pathParent: '',
      };
    },
  },
  watch: {
    params() {
      this.schemaMaybeChanged();
    },
    'meta.schema': function () {
      this.schemaMaybeChanged();
    },
    data() {
      this.initData();
    },
    parcel(newValue) {
      this.$emit('parcelChanged', newValue);
    },
    errors(newValue) {
      this.verrors = newValue;
    },
    searchStates(newValue) {
      this.vSearchStates = newValue;
    },
  },
  created() {
    this.initData();
    this.vSearchStates = this.searchStates;
  },
  mounted() {
    this.fetchSchema();
  },
  beforeDestroy() {
    this.callbacksPerformBefore = [];
    this.callbacksPerformAfter = [];
  },
  methods: {
    schemaMaybeChanged() {
      this.custom = null;
      this.$nextTick(() => {
        this.fetchSchema();
      });
    },
    _resetErrors() {
      this.verrors = null;
      this.$emit('errorsReset');
    },
    initData() {
      this.dataCopy = this.$meta.util.extend({}, this.data);
      this.dataInit = this.$meta.util.extend({}, this.data);
    },
    async reset() {
      if (!this.ready) return;
      this._resetErrors();
      this.$meta.util.replaceItem(this.data, this.dataInit);
      this.dataCopy = this.$meta.util.extend({}, this.data);
      if (this.onReset) {
        await this.onReset(this.data);
      }
    },
    async flush() {
      if (!this.ready) return;
      this._resetErrors();
      this.dataInit = this.$meta.util.extend({}, this.data);
      if (this.onFlush) {
        await this.onFlush(this.data);
      }
    },
    async perform(event, context) {
      if (this.auto && !this.ready) return null;
      if (!this.onPerform) return null;
      // perform before, need not wrapper error/exception
      await this._invokePerformBefore(event, context);
      // perform
      try {
        const data = await this.onPerform(event, context);
        // perform after
        await this._invokePerformAfter(event, context, null, data);
        await this.flush();
        // ok
        return data;
      } catch (err) {
        if (err) {
          // perform after, need not wrapper error/exception
          await this._invokePerformAfter(event, context, err, null);
          // inner handle
          if (err.code !== 422) throw err;
          this.verrors = err.message;
          this.$emit('errorsSet', this.verrors);
          const _err = new Error(this.$text('Data Validation Error'));
          _err.code = -422;
          throw _err;
        }
      }
    },
    // not wrapper error/exception
    async _invokePerformBefore(event, context) {
      const params = { event, context };
      // callbacks
      if (this.callbacksPerformBefore && this.callbacksPerformBefore.length > 0) {
        for (const cb of this.callbacksPerformBefore) {
          await cb(params);
        }
      }
      // prop
      if (this.onPerformBefore) {
        await this.onPerformBefore(params);
      }
    },
    // not wrapper error/exception
    async _invokePerformAfter(event, context, err, data) {
      const params = { event, context, err, data };
      // callbacks
      if (this.callbacksPerformAfter && this.callbacksPerformAfter.length > 0) {
        for (const cb of this.callbacksPerformAfter) {
          await cb(params);
        }
      }
      // prop
      if (this.onPerformAfter) {
        await this.onPerformAfter(params);
      }
    },
    registerCallbackPerformBefore(callback) {
      this.callbacksPerformBefore.push(callback);
    },
    unRegisterCallbackPerformBefore(callback) {
      const index = this.callbacksPerformBefore.indexOf(callback);
      if (index > -1) {
        this.callbacksPerformBefore.splice(index, 1);
      }
    },
    registerCallbackPerformAfter(callback) {
      this.callbacksPerformAfter.push(callback);
    },
    unRegisterCallbackPerformAfter(callback) {
      const index = this.callbacksPerformAfter.indexOf(callback);
      if (index > -1) {
        this.callbacksPerformAfter.splice(index, 1);
      }
    },
    getError(dataPath) {
      if (!this.verrors || !dataPath) return '';
      dataPath = this.adjustDataPath(dataPath);
      const error = this.verrors.find(item => {
        if (dataPath.charAt(dataPath.length - 1) === '/') return item.dataPath.indexOf(dataPath) > -1;
        return item.dataPath === dataPath;
      });
      return error ? error.message : '';
    },
    clearError(dataPath) {
      if (!this.verrors || !dataPath) return;
      dataPath = this.adjustDataPath(dataPath);
      while (true) {
        const index = this.verrors.findIndex(item => item.dataPath === dataPath);
        if (index > -1) {
          this.verrors.splice(index, 1);
        } else {
          break;
        }
      }
    },
    adjustDataPath(dataPath) {
      if (!dataPath) return dataPath;
      if (dataPath[0] !== '/') return this.dataPathRoot + dataPath;
      return dataPath;
    },
    async fetchSchema() {
      if (this.meta && this.meta.schema) {
        this.schemaModuleName = this.meta.schema.module || this.$pageContainer.$module.name;
        await this.$meta.module.use(this.schemaModuleName);
        await this.__schemaReady(this.meta.schema.schema, this.schemaModuleName);
        return;
      }
      if (!this.params) return;
      const moduleName = this.params.module || this.$pageContainer.$module.name;
      this.schemaModuleName = moduleName;
      await this.$meta.module.use(moduleName);
      // useStore
      const useStoreSchemas = await this.$store.use('a/validation/schemas');
      const data = await useStoreSchemas.getSchema({
        module: moduleName,
        validator: this.params.validator,
        schema: this.params.schema,
      });
      if (!data.schema) {
        throw new Error(
          `validator/schema not found: ${moduleName}:${this.params.validator}${
            this.params.schema ? ':' + this.params.schema : ''
          }`
        );
      }
      await this.__schemaReady(data.schema, moduleName);
    },
    async __schemaReady(schema, moduleMaybe) {
      const _componentName = schema.meta && schema.meta.custom && schema.meta.custom.component;
      if (!_componentName) {
        this.renderModuleName = moduleMaybe;
        await this.__schemaReady2(schema);
        return;
      }
      // custom
      const moduleName = schema.meta.custom.module || moduleMaybe;
      this.renderModuleName = moduleName;
      await this.$meta.module.use(moduleName);
      this.custom = {
        module: moduleName,
        name: _componentName,
      };
      await this.__schemaReady2(schema);
    },
    async __schemaReady2(schema) {
      // patchSchema
      // await this.__schemaReady_patchSchema(schema);
      // ready
      this.__schemaReady3(schema);
    },
    __schemaReady3(schema) {
      this.schema = schema;
      if (this.errors) this.verrors = this.errors;
      // event
      this.$emit('schema:ready', this.schema);
      this.$emit('schemaReady', this.schema);
    },
    __getDevValidateParams() {
      if (this.$meta.config.env !== 'development') return null;
      if (!this.params) return null;
      const data = [];
      if (this.params.module) data.module = this.params.module;
      if (this.params.validator) data.validator = this.params.validator;
      if (this.params.schema) data.schema = this.params.schema;
      return this.$meta.util.combineParams(data);
    },
    // async __schemaReady_patchSchema(schema) {
    //   await this.__schemaReady_patchSchema_properties(schema.properties);
    // },
    // async __schemaReady_patchSchema_properties(properties) {
    //   for (const key in properties) {
    //     const property = properties[key];
    //     if (property.ebType === 'component-action' && property.ebRender) {
    //       if (!property.ebRender.actionModule) throw new Error(`actionModule not set for component-action: ${key}`);
    //       await this.$meta.module.use(property.ebRender.actionModule);
    //     } else if (property.type === 'object' && property.properties) {
    //       await this.__schemaReady_patchSchema_properties(property.properties);
    //     }
    //   }
    // },
    renderSchema() {
      const devValidateParams = this.__getDevValidateParams();
      return (
        <validateItem
          data-dev-validate-params={devValidateParams}
          parcel={this.parcel}
          dataKey={null}
          property={null}
          meta={null}
          root={true}
        ></validateItem>
      );
    },
    onSubmit(event) {
      this.$emit('submit', event);
    },
  },
};
