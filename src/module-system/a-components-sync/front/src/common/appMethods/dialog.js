import progressbar from './progressbar.js';

export default function (ctx) {
  const dialog = {};
  // create
  dialog.create = function (params) {
    ctx.$utils.extend(params, {
      hostEl: ctx.getHostEl && ctx.getHostEl(),
    });
    return ctx.$f7.dialog.create(params);
  };
  // close
  dialog.close = function () {
    ctx.$f7.dialog.close();
  };
  // preloader / progress
  for (const method of ['preloader', 'progress']) {
    dialog[method] = function (...args) {
      return ctx.$f7.dialog[method](ctx.getHostEl && ctx.getHostEl(), ...args);
    };
  }
  // alert
  dialog.alert = function (text, title) {
    return new Promise((resolve, reject) => {
      ctx.$f7.dialog.alert(ctx.getHostEl && ctx.getHostEl(), text, title, () => resolve());
    });
  };
  // prompt
  dialog.prompt = function (text, title, defaultValue) {
    return new Promise((resolve, reject) => {
      ctx.$f7.dialog.prompt(
        ctx.getHostEl && ctx.getHostEl(),
        text,
        title,
        value => resolve(value),
        value => reject(value),
        defaultValue
      );
    });
  };
  // confirm
  dialog.confirm = function (text, title) {
    if (!text) text = ctx.$text('GeneralPerformOperationConfirm');
    return new Promise((resolve, reject) => {
      ctx.$f7.dialog.confirm(
        ctx.getHostEl && ctx.getHostEl(),
        text,
        title,
        () => resolve(),
        () => reject(new Error())
      );
    });
  };
  // progressbar
  dialog.progressbar = function ({ progressId, title, canBreak = true, color, progress = 0 }) {
    return progressbar({ ctx, progressId, title, canBreak, color, progress });
  };
  return dialog;
}
