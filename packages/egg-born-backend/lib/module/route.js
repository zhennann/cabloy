const is = require('is-type-of');
const extend = require('extend2');
const pathMatching = require('egg-path-matching');
const util = require('./util.js');
const loadMiddlewares = require('./middleware.js');
const MWSTATUS = Symbol('Context#__wmstatus');
const TAILCALLBACKS = Symbol.for('Context#__tailcallbacks');

module.exports = function(loader, modules) {

  // load middlewares
  const [ ebMiddlewares, ebMiddlewaresGlobal ] = loadMiddlewares(loader, modules);

  // patch router
  patchRouter();

  // load routes
  loadRoutes();

  function patchRouter() {
    loader.app.meta.router = {
      register(info, route) {
        // args
        const args = [];
        // name
        if (route.name) args.push(route.name);
        // path
        args.push(typeof route.path === 'string' ? util.combineFetchPath(info, route.path) : route.path);

        // constroller
        let controllerBeanFullName;
        let _route;
        if (route.controller) {
          if (is.function(route.controller)) throw new Error(`Controller should be bean: ${info.relativeName}.${route.controller(loader.app).name}`);
          if (typeof route.controller === 'string') {
            controllerBeanFullName = `${info.relativeName}.controller.${route.controller}`;
          } else {
            controllerBeanFullName = `${route.controller.module || info.relativeName}.controller.${route.controller.name}`;
          }
          // _route
          _route = {
            pid: info.pid,
            module: info.name,
            controller: route.controller,
            action: route.action || route.path.substr(route.path.lastIndexOf('/') + 1),
          };
        }

        // middlewares: start
        const fnStart = async (ctx, next) => {
          // callbacks
          ctx[TAILCALLBACKS] = [];
          // status
          ctx[MWSTATUS] = {};
          // route
          ctx.route = _route;
          // dynamic options
          if (!ctx.meta) ctx.meta = {};
          ctx.meta.middlewares = {};
          // next
          await next();
          // invoke callbackes
          for (const cb of ctx[TAILCALLBACKS]) {
            await cb();
          }
        };
        fnStart._name = 'start';
        args.push(fnStart);

        // middlewares: globals
        ebMiddlewaresGlobal.forEach(key => {
          const item = ebMiddlewares[key];
          args.push(wrapMiddleware(item, route, loader));
        });

        // middlewares: route
        if (route.middlewares) {
          let middlewares = route.middlewares;
          if (is.string(middlewares)) middlewares = middlewares.split(',');
          middlewares.forEach(key => {
            if (is.string(key)) {
              const item = ebMiddlewares[key];
              if (item) {
                args.push(wrapMiddleware(item, route, loader));
              } else {
                args.push(wrapMiddlewareApp(key, route, loader));
              }
            } else {
              args.push(key);
            }
          });
        }

        // controller
        if (route.controller) {
          // middleware controller
          args.push(methodToMiddleware(controllerBeanFullName, _route));
        }

        // load
        loader.app.router[route.method].apply(loader.app.router, args);
      },
      unRegister(name) {
        const index = loader.app.router.stack.findIndex(layer => layer.name && layer.name === name);
        if (index > -1) loader.app.router.stack.splice(index, 1);
      },
      findByPath(moduleName, arg) {
        const path = util.combineFetchPath(moduleName, arg);
        return loader.app.router.stack.find(layer => layer.path === path);
      },
    };
  }

  function loadRoutes() {
    // load routes
    Object.keys(modules).forEach(key => {

      const module = modules[key];

      // routes and controllers
      const routes = module.main.routes;
      if (routes) {
        routes.forEach(route => {
          loader.app.meta.router.register(module.info, route);
        });
      }

    });
  }

};

function wrapMiddlewareApp(key, route, loader) {
  try {
    const middleware = loader.app.middlewares[key];
    const optionsRoute = route.meta ? route.meta[key] : null;
    const options = optionsRoute ? extend(true, {}, loader.app.config.mws[key], optionsRoute) : loader.app.config.mws[key];
    const mw = middleware(options, loader.app);
    mw._name = key;
    return mw;
  } catch (err) {
    console.log(`\nmiddleware error: ${key}\n`);
    throw err;
  }
}

function wrapMiddleware(item, route, loader) {
  const optionsRoute = route.meta ? route.meta[item.key] : null;
  const options = optionsRoute ? extend(true, {}, item.options, optionsRoute) : item.options;
  const mw = item.middleware(options, loader.app);
  mw._name = item.key;
  return wrapMiddleware2(mw, options);
}

function wrapMiddleware2(mw, options) {
  const fn = (ctx, next) => {
    // dynamic options
    const optionsDynamic = ctx.meta.middlewares[mw._name];
    const options2 = optionsDynamic ? extend(true, {}, options, optionsDynamic) : options;
    // enable match ignore dependencies
    if (options2.enable === false || !middlewareMatch(ctx, options2) || !middlewareDeps(ctx, options2)) {
      ctx[MWSTATUS][mw._name] = false;
      return next();
    }
    // run
    return mw(ctx, next, options2);
  };
  fn._name = mw._name + 'middlewareWrapper';
  return fn;
}

function middlewareMatch(ctx, options) {
  if (!options.match && !options.ignore) {
    return true;
  }
  const match = pathMatching(options);
  return match(ctx);
}

function middlewareDeps(ctx, options) {
  let deps = options.dependencies || [];
  if (typeof deps === 'string') deps = deps.split(',');
  return deps.every(key => ctx[MWSTATUS][key] !== false);
}

function methodToMiddleware(controllerBeanFullName, _route) {
  return function classControllerMiddleware(...args) {
    const controller = this.bean._getBean(controllerBeanFullName);
    return controller[_route.action](...args);
  };
}
