(()=>{var e={129:e=>{e.exports=e=>({})},521:(e,t,a)=>{function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,o=new Array(t);a<t;a++)o[a]=e[a];return o}const n=a(638)("@zhennann/trim-html");e.exports=e=>{const t=e.meta.mockUtil.parseInfoFromPackage(__dirname);class a extends e.meta.AtomBase{get moduleConfig(){return this.ctx.config.module(t.relativeName)}async create(e){let{atomClass:t,item:a,user:o}=e;const n=await super.create({atomClass:t,item:a,user:o}),r=await this.ctx.model.note.insert({atomId:n.atomId});return{atomId:n.atomId,itemId:r.insertId}}async read(e){let{atomClass:t,options:a,key:o,user:n}=e;const r=await super.read({atomClass:t,options:a,key:o,user:n});return r?(this._getMeta(r),r):null}async select(e){let{atomClass:t,options:a,items:n,user:r}=e;await super.select({atomClass:t,options:a,items:n,user:r});var s,i=function(e,t){var a="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=function(e,t){if(e){if("string"==typeof e)return o(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?o(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){a&&(e=a);var n=0,r=function(){};return{s:r,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,i=!0,m=!1;return{s:function(){a=a.call(e)},n:function(){var e=a.next();return i=e.done,e},e:function(e){m=!0,s=e},f:function(){try{i||null==a.return||a.return()}finally{if(m)throw s}}}}(n);try{for(i.s();!(s=i.n()).done;){const e=s.value;this._getMeta(e)}}catch(e){i.e(e)}finally{i.f()}}async write(e){let{atomClass:t,target:a,key:o,item:n,options:r,user:s}=e;await super.write({atomClass:t,target:a,key:o,item:n,options:r,user:s});const i=await this.ctx.model.note.prepareData(n);i.id=o.itemId,i.html=await this._renderContent({item:n,atomId:o.atomId}),i.summary=this._parseSummary({html:i.html}),await this.ctx.model.note.update(i)}async delete(e){let{atomClass:t,key:a,user:o}=e;await super.delete({atomClass:t,key:a,user:o}),await this.ctx.model.note.delete({id:a.itemId})}async _renderContent(e){let{item:t,atomId:a}=e;return await this.ctx.bean.markdown.render({host:{atom:t,atomId:a},content:t.content,locale:this.ctx.locale})}_parseSummary(e){let{html:t}=e,a="";return t&&(a=n(t,this.moduleConfig.note.trim).html.trim()),a}_getMeta(e){this._ensureItemMeta(e).summary=e.summary}}return a}},223:e=>{e.exports=e=>{class t extends e.meta.BeanBase{async update(e){if(1===e.version){const e="\n          CREATE TABLE testNote (\n            id int(11) NOT NULL AUTO_INCREMENT,\n            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n            deleted int(11) DEFAULT '0',\n            iid int(11) DEFAULT '0',\n            atomId int(11) DEFAULT '0',\n            summary TEXT DEFAULT NULL,\n            content LONGTEXT DEFAULT NULL,\n            html LONGTEXT DEFAULT NULL,\n            PRIMARY KEY (id)\n          )\n        ";await this.ctx.model.query(e)}}async init(e){if(1===e.version){const e=[{roleName:"authenticated",action:"create"},{roleName:"authenticated",action:"read",scopeNames:0},{roleName:"authenticated",action:"write",scopeNames:0},{roleName:"authenticated",action:"delete",scopeNames:0},{roleName:"authenticated",action:"clone",scopeNames:0},{roleName:"authenticated",action:"deleteBulk"},{roleName:"authenticated",action:"exportBulk"},{roleName:"authenticated",action:"layoutBulk"},{roleName:"system",action:"read",scopeNames:"authenticated"},{roleName:"root",action:"layout",scopeNames:"root"}];await this.ctx.bean.role.addRoleRightBatch({atomClassName:"note",roleRights:e})}}async test(){}}return t}},313:(e,t,a)=>{const o=a(223),n=a(521);e.exports=e=>({"version.manager":{mode:"app",bean:o},"atom.note":{mode:"app",bean:n}})},731:(e,t,a)=>{const o=a(479),n=a(967),r=a(846),s=a(72);e.exports={"en-us":{"demo-1":o,"demo-2":n},"zh-cn":{"demo-1":r,"demo-2":s}}},479:e=>{e.exports={atomName:"CabloyJS",content:"## CabloyJS\n\n  A Node.js full-stack framework with workflow engine, based on koa + egg + vue + framework7 + mysql\n  \n  ### Features\n  \n  CableyJS provides a lot of features that shine in front of you. Here are only three examples:\n\n  1. Adaptive Layout: `pc = mobile + pad`\n  2. Automatic form rendering and data validation engine based on JSON Schema\n  3. Built-in NodeJS workflow engine\n  \n  ### Architectures\n  \n  CableyJS has developed many distinctive architecture designs. Here are only three examples:\n  \n  1. Business Modularization & Module Isolation\n  2. Frontend and Backend Separation & Multi Scenario Development\n  3. Cluster Framework\n"}},967:e=>{e.exports={atomName:"Today",content:'### Today\'s Music\n\n  $$$ a-markdownblock:audio\n  {\n    "audio": {\n      "name": "Roses and Gold",\n      "url": "https://admin2.zhennann.com/api/a/file/file/download/0d0990d0f68e495c98857252521032a4.mp3",\n      "artist": "Robin Jackson",\n      "cover": "https://admin2.zhennann.com/api/a/file/file/download/52e763b10a3a4b2e9567be64e10c5a18.jpg"\n    },\n    "autoplay": false,\n    "loop": true\n  }\n  $$$\n  \n  ### Today\'s Tasks \n  \n  1. [x]  Run for 30 minutes\n  2. [ ]  Keep one diary\n  3. [ ]  Read 20 pages\n'}},846:e=>{e.exports={atomName:"CabloyJS",content:"## CabloyJS\n\n  一款自带工作流引擎的Node.js全栈框架, `接单快手、创业神器`, 基于koa + egg + vue + framework7 + mysql\n  \n  ### 功能四大亮点\n  \n  CabloyJS提供了诸多`耳目一新`的功能，这里仅举四例：\n  \n  1. 自适应布局：`pc = mobile + pad`\n  2. 基于JSON Schema的表单自动渲染与数据验证引擎\n  3. 所见即所得的Markdown富文本编辑器及渲染引擎\n  4. 内置NodeJS工作流引擎\n  \n  ### 架构四大亮点\n  \n  CabloyJS研发了诸多`别具一格`的架构设计，这里仅举四例：\n  \n  1. 模块化开发体系与模块隔离\n  2. 原生分布式架构，支持集群部署\n  3. 原生`多实例/多域名/多租户`设计，支援SAAS系统开发\n  4. 前后端分离，全场景跨端开发，支持PC Web、PC Desktop、Mobile、IOS、Android、微信公众号、企业微信、钉钉、小程序，等等\n"}},72:e=>{e.exports={atomName:"今日",content:'### 今日金曲\n\n  $$$ a-markdownblock:audio\n  {\n    "audio": {\n      "name": "Roses and Gold",\n      "url": "https://admin2.zhennann.com/api/a/file/file/download/0d0990d0f68e495c98857252521032a4.mp3",\n      "artist": "Robin Jackson",\n      "cover": "https://admin2.zhennann.com/api/a/file/file/download/52e763b10a3a4b2e9567be64e10c5a18.jpg"\n    },\n    "autoplay": false,\n    "loop": true\n  }\n  $$$\n  \n  ### 今日任务 \n  \n  1. [x]  跑步30分钟\n  2. [ ]  日记1篇\n  3. [ ]  读书20页\n'}},817:e=>{e.exports=e=>({note:{trim:{limit:100,wordBreak:!1,preserveTags:!1}}})},971:e=>{e.exports={}},724:e=>{e.exports={}},995:e=>{e.exports={Note:"便签","Create Note":"新建便签","Note List":"便签列表","Note Test":"便签测试"}},266:(e,t,a)=>{e.exports={"en-us":a(724),"zh-cn":a(995)}},1:e=>{e.exports=e=>{const t=e.meta.mockUtil.parseInfoFromPackage(__dirname);return[{atomName:"Create Note",atomStaticKey:"createNote",atomRevision:0,atomCategoryId:"a-base:menu.Create",resourceType:"a-base:menu",resourceConfig:JSON.stringify({module:t.relativeName,atomClassName:"note",atomAction:"create"}),resourceRoles:"authenticated"},{atomName:"Note List",atomStaticKey:"listNote",atomRevision:0,atomCategoryId:"a-base:menu.List",resourceType:"a-base:menu",resourceConfig:JSON.stringify({module:t.relativeName,atomClassName:"note",atomAction:"read"}),resourceRoles:"authenticated"},{atomName:"Note",atomStaticKey:"widgetNote",atomRevision:0,atomCategoryId:"a-dashboard:widget.Demonstration",resourceType:"a-dashboard:widget",resourceConfig:JSON.stringify({module:t.relativeName,component:"widgetNote"}),resourceRoles:"root"}]}},70:e=>{e.exports=e=>({note:{type:"object",properties:{atomName:{type:"string",ebType:"text",ebTitle:"Title",notEmpty:!0},content:{type:"string",ebType:"markdown-content",ebTitle:"Content"}}},noteSearch:{type:"object",properties:{content:{type:"string",ebType:"text",ebTitle:"Content"}}}})},326:(e,t,a)=>{const o=a(70);e.exports=e=>{const t={};return Object.assign(t,o(e)),t}},715:e=>{e.exports=e=>{class t extends e.Controller{async createNote(){const e=await this.ctx.service.demo.createNote({demoKey:this.ctx.request.body.demoKey,user:this.ctx.state.user.op});this.ctx.success(e)}}return t}},691:(e,t,a)=>{const o=a(715);e.exports=e=>({demo:o})},312:(e,t,a)=>{const o=a(817),n=a(266),r=a(971);e.exports=e=>{const t=a(129)(e),s=a(313)(e),i=a(788)(e),m=a(691)(e),c=a(481)(e),l=a(700)(e),d=a(730)(e);return{aops:t,beans:s,routes:i,controllers:m,services:c,models:l,config:o,locales:n,errors:r,meta:d}}},730:(e,t,a)=>{e.exports=e=>{const t=a(326)(e);return{base:{atoms:{note:{info:{bean:"note",title:"Note",tableName:"testNote",language:!1,category:!0,tag:!0,simple:!0,history:!1},actions:{},validator:"note",search:{validator:"noteSearch"}}},statics:{"a-base.resource":{items:a(1)(e)}}},validation:{validators:{note:{schemas:"note"},noteSearch:{schemas:"noteSearch"}},keywords:{},schemas:t},index:{indexes:{testNote:"createdAt,updatedAt,atomId"}}}}},732:e=>{e.exports=e=>{class t extends e.meta.Model{constructor(e){super(e,{table:"testNote",options:{disableDeleted:!1}})}}return t}},700:(e,t,a)=>{const o=a(732);e.exports=e=>({note:o})},788:e=>{e.exports=e=>[{method:"post",path:"demo/createNote",controller:"demo",meta:{auth:{user:!0}}}]},528:(e,t,a)=>{const o=a(731);e.exports=e=>{const t={module:e.meta.mockUtil.parseInfoFromPackage(__dirname).relativeName,atomClassName:"note"};class a extends e.Service{async createNote(e){let{demoKey:a,user:n}=e;const r=o[this.ctx.locale][a],s=await this.ctx.bean.atom.preferredRoleId({atomClass:t,user:n}),i=await this.ctx.bean.atom.create({atomClass:t,roleIdOwner:s,user:n});return await this.ctx.bean.atom.write({key:i,item:{atomName:r.atomName,content:r.content},user:n}),i}}return a}},481:(e,t,a)=>{const o=a(528);e.exports=e=>({demo:o})},638:e=>{"use strict";e.exports=require("require3")}},t={},a=function a(o){var n=t[o];if(void 0!==n)return n.exports;var r=t[o]={exports:{}};return e[o](r,r.exports,a),r.exports}(312);module.exports=a})();