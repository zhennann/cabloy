const __module__ = module;
module.exports = class Validation extends module.meta.class.BeanModuleBase {
  getSchema({ module, validator, schema }) {
    // for flexible
    if (schema && typeof schema === 'object') {
      return { module, validator, schema };
    }
    module = module || this.moduleName;
    const meta = this.ctx.app.meta.modules[module].main.meta;
    if (!schema) {
      const _validator = this.getValidator({ module, validator });
      if (!_validator) throw new Error(`validator not found: ${module}:${validator}`);
      const schemas = this._adjustSchemas(_validator.schemas);
      schema = schemas[0];
    }
    return {
      module,
      validator,
      schema: this.ctx.bean.util.getProperty(meta, `validation.schemas.${schema}`),
    };
  }

  getValidator({ module, validator }) {
    module = module || this.moduleName;
    const meta = this.ctx.app.meta.modules[module].main.meta;
    let _validator = this.ctx.bean.util.getProperty(meta, `validation.validators.${validator}`);
    if (!_validator) {
      const _schema = this.ctx.bean.util.getProperty(meta, `validation.schemas.${validator}`);
      if (!_schema) return null;
      _validator = {
        schemas: validator,
      };
      this.ctx.bean.util.setProperty(meta, `validation.validators.${validator}`, _validator);
    }
    return _validator;
  }

  async validate({ module, validator, schema, data, filterOptions }) {
    // validator
    const _validator = this._checkValidator({ module, validator, filterOptions });
    // ignoreRules
    const ignoreRules = filterOptions && filterOptions.ignoreRules;
    // cache key
    const cacheKey = ignoreRules ? 'ajv_ignoreRules' : 'ajv';
    return await _validator[cacheKey].v({ ctx: this.ctx, schema, data, filterOptions });
  }

  async ajvFromSchemaAndValidate({ module, schema, data, filterOptions }) {
    if (typeof schema === 'string') {
      const _schema = this.getSchema({ module, schema });
      schema = _schema.schema;
    }
    const ajv = this.ajvFromSchema({ module, schema, filterOptions });
    return await this.ajvValidate({ ajv, schema: null, data, filterOptions });
  }

  async ajvValidate({ ajv, schema, data, filterOptions }) {
    return await ajv.v({ ctx: this.ctx, schema, data, filterOptions });
  }

  ajvFromSchema({ module, schema, filterOptions }) {
    // ignoreRules
    const ignoreRules = filterOptions && filterOptions.ignoreRules;
    // params
    let options;
    if (ignoreRules) {
      options = { coerceTypes: false, useDefaults: true }; // not use _validator.options
    } else {
      options = {};
    }
    const params = {
      options,
    };
    // keywords
    if (module) {
      module = module || this.moduleName;
      const meta = this.ctx.app.meta.modules[module].main.meta;
      params.keywords = meta.validation.keywords;
    }
    // schemas
    params.schemaRoot = this.ctx.bean.util.uuid.v4();
    const schemas = {
      [params.schemaRoot]: { ...schema, $async: true },
    };
    if (ignoreRules) {
      params.schemas = this._prepareSchemas_ignoreRules({ schemas });
    } else {
      params.schemas = schemas;
    }
    // create
    return __module__.meta.class.Ajv.create(params);
  }

  _checkValidator({ module, validator }) {
    // check ajv cache
    module = module || this.moduleName;
    const meta = this.ctx.app.meta.modules[module].main.meta;
    const _validator = this.getValidator({ module, validator });
    if (!_validator) throw new Error(`validator not found: ${module}:${validator}`);
    if (_validator.ajv) return _validator;
    // create ajv
    const _schemas = this._adjustSchemas(_validator.schemas);
    const schemas = {};
    for (const _schema of _schemas) {
      schemas[_schema] = meta.validation.schemas[_schema];
      if (!schemas[_schema]) throw new Error(`schema not found: ${module}:${_schema}`);
      schemas[_schema].$async = true;
    }
    _validator.ajv = __module__.meta.class.Ajv.create({
      options: _validator.options,
      keywords: meta.validation.keywords,
      schemas,
      schemaRoot: _schemas[0],
    });
    // create ajv_ignoreRules
    const schemas2 = this._prepareSchemas_ignoreRules({ schemas });
    _validator.ajv_ignoreRules = __module__.meta.class.Ajv.create({
      options: { coerceTypes: false, useDefaults: true }, // not use _validator.options
      keywords: meta.validation.keywords,
      schemas: schemas2,
      schemaRoot: _schemas[0],
    });
    // ok
    return _validator;
  }

  _prepareSchemas_ignoreRules({ schemas }) {
    const schemas2 = {};
    for (const schemaName in schemas) {
      const schema = schemas[schemaName];
      const schema2 = { type: 'object', properties: {} };
      this._prepareProperties_ignoreRules({ propertiesFrom: schema.properties, propertiesTo: schema2.properties });
      schemas2[schemaName] = schema2;
    }
    return schemas2;
  }

  _prepareProperties_ignoreRules({ propertiesFrom, propertiesTo }) {
    const __basicRuleNames = ['type', 'ebType', 'ebCopy', 'ebReadOnly', '$async'];
    for (const key in propertiesFrom) {
      const propertyFrom = propertiesFrom[key];
      const propertyTo = {};
      propertiesTo[key] = propertyTo;
      for (const ruleName in propertyFrom) {
        if (__basicRuleNames.includes(ruleName)) {
          propertyTo[ruleName] = propertyFrom[ruleName];
        }
        if (ruleName === 'properties') {
          propertyTo.properties = {};
          this._prepareProperties_ignoreRules({
            propertiesFrom: propertyFrom.properties,
            propertiesTo: propertyTo.properties,
          });
        }
      }
    }
  }

  _adjustSchemas(schemas) {
    if (typeof schemas === 'string') return schemas.split(',');
    return schemas;
  }

  async _validate({ atomClass, data, options, filterOptions }) {
    // validator
    const optionsSchema = options && options.schema;
    if (optionsSchema) {
      if (
        optionsSchema.validator &&
        (!optionsSchema.schema || typeof optionsSchema.schema === 'string' || optionsSchema.isSchemaBase)
      ) {
        const schema = optionsSchema.isSchemaBase ? null : optionsSchema.schema;
        // use validator directly
        await this.validate({
          module: optionsSchema.module,
          validator: optionsSchema.validator,
          schema,
          data,
          filterOptions,
        });
      } else {
        // create validator dynamicly
        await this.ajvFromSchemaAndValidate({
          module: optionsSchema.module,
          schema: optionsSchema.schema,
          data,
          filterOptions,
        });
      }
    } else if (atomClass) {
      const validator = await this.ctx.bean.atom.validator({ atomClass });
      if (validator) {
        // if error throw 422
        await this.validate({
          module: validator.module,
          validator: validator.validator,
          schema: validator.schema,
          data,
          filterOptions,
        });
      }
    }
  }
};
