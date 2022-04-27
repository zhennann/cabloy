const fs = require('fs');
const path = require('path');
const require3 = require('require3');
const glob = require3('globby');
const mkdirp = require3('mkdirp');
const isTextOrBinary = require3('istextorbinary');
const ejs = require3('@zhennann/ejs');
const gogocode = require3('gogocode');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    constructor(cli) {
      this.cli = cli;
    }

    get options() {
      return this.cli.options;
    }

    get context() {
      return this.cli.options.context;
    }

    get console() {
      return this.cli.console;
    }

    get helper() {
      return this.cli.helper;
    }

    get moduleConfig() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    get fileMapping() {
      return this.moduleConfig.template.render.fileMapping;
    }

    get filesIgnore() {
      return this.moduleConfig.template.render.ignore;
    }

    resolvePath({ moduleName, path: _path }) {
      const module = this.helper.findModule(moduleName);
      return path.join(module.root, 'backend/cli/templates', _path);
    }

    async renderDir({ targetDir, templateDir }) {
      const { argv } = this.context;
      // files
      const files = glob.sync('**/*', {
        cwd: templateDir,
        dot: true,
        onlyFiles: false,
        followSymlinkedDirectories: false,
      });
      // loop
      for (const file of files) {
        const { dir: dirname, base: basename } = path.parse(file);
        if (this.filesIgnore.includes(basename)) continue;
        const templateFile = path.join(templateDir, file);
        const fileName = this.fileMapping[basename] || basename;
        const targetFile = path.join(targetDir, dirname, ctx.bean.util.replaceTemplate(fileName, argv));
        await this.renderFile({ targetFile, templateFile });
      }
      return files;
    }

    async renderFile({ targetFile, templateFile }) {
      const stats = fs.lstatSync(templateFile);
      if (stats.isSymbolicLink()) {
        const target = fs.readlinkSync(templateFile);
        fs.symlinkSync(target, targetFile);
        await this.console.log(`${targetFile} link to ${target}`);
      } else if (stats.isDirectory()) {
        mkdirp.sync(targetFile);
      } else if (stats.isFile()) {
        let content = fs.readFileSync(templateFile);
        await this.console.log(`write to ${targetFile}`);
        // check if content is a text file
        let result;
        let changed;
        if (!isTextOrBinary.isTextSync(templateFile, content)) {
          result = content;
        } else {
          content = content.toString('utf8');
          result = await this.renderContent({ content });
          changed = content !== result;
        }
        // save
        fs.writeFileSync(targetFile, result);
        // format
        if (changed) {
          await this.helper.formatFile({ fileName: targetFile, logPrefix: 'format: ' });
        }
      } else {
        await this.console.log(`ignore ${templateFile}, only support file, dir, symlink`);
      }
    }

    async renderContent({ content }) {
      const data = this.getEjsData();
      const options = this.getEjsOptions();
      return await ejs.render(content, data, options);
    }

    getEjsOptions() {
      return {
        async: true,
        cache: false,
        compileDebug: ctx.app.meta.isTest || ctx.app.meta.isLocal,
        outputFunctionName: 'echo',
        rmWhitespace: false,
      };
    }

    getEjsData() {
      return {
        ...this.context,
        ctx,
      };
    }

    getAstData(ast, snippet) {
      return {
        ast,
        snippet,
        ...this.context,
        ctx,
      };
    }

    async applySnippets({ targetDir, snippetsDir }) {
      // snippets
      const files = glob.sync('*.js', {
        cwd: snippetsDir,
        onlyFiles: true,
      });
      // snippets sort
      files.sort((a, b) => this._parseSnippetFilePrefix(a) - this._parseSnippetFilePrefix(b));
      // for
      for (const file of files) {
        const snippet = require3(path.join(snippetsDir, file));
        const targetFile = path.join(targetDir, snippet.file);
        await this.applySnippet({ targetFile, snippet });
      }
    }

    async applySnippet({ targetFile, snippet }) {
      await this.console.log(`apply changes to ${targetFile}`);
      // source code
      let sourceCode = fs.readFileSync(targetFile);
      sourceCode = sourceCode.toString('utf8');
      // language
      const language = snippet.parseOptions && snippet.parseOptions.language;
      // transform
      let outputCode;
      if (language === 'json') {
        const ast = JSON.parse(sourceCode);
        const outAst = snippet.transform(this.getAstData(ast, snippet));
        outputCode = JSON.stringify(outAst, null, 2);
      } else {
        const ast = gogocode(sourceCode, { parseOptions: snippet.parseOptions });
        const outAst = snippet.transform(this.getAstData(ast, snippet));
        outputCode = outAst.root().generate();
      }
      // save
      fs.writeFileSync(targetFile, outputCode);
      // format
      await this.helper.formatFile({ fileName: targetFile, logPrefix: 'format: ' });
    }

    _parseSnippetFilePrefix(fileName) {
      const num = fileName.split('-')[0];
      if (!num || isNaN(num)) return 10000;
      return parseInt(num);
    }
  }
  return Local;
};
