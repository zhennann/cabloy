export default {
  data() {
    return {
      app: {
        keyDefault: 'a-app:appDefault',
        appMenuDefaultChecked: false, // only once
      },
    };
  },
  methods: {
    async app_openHome_bySlogon() {
      // current
      const current = this.$store.getters['a/app/current'];
      const appItemCurrent = await this.$store.dispatch('a/app/getAppItem', { appKey: current.appKey });
      if (!this.app_isDefault(current.appKey) && !appItemCurrent.isolate) {
        this.$meta.store.commit('a/app/setCurrent', { appKey: this.app.keyDefault });
      }
      // open
      await this.app_openHome({ force: true });
    },
    async app_openHome({ appKey, appLanguage, force = false }) {
      // set current
      this.$meta.store.commit('a/app/setCurrent', { appKey, appLanguage });
      // get current
      const current = this.$store.getters['a/app/current'];
      // current
      const appItemCurrent = await this.$store.dispatch('a/app/getAppItem', { appKey: current.appKey });
      // open menu
      await this.app_openAppMenu({ current, appItemCurrent });
      // open home
      await this.app_openAppHome({ current, appItemCurrent, force });
      // open mine
      await this.app_openAppMine({ current, appItemCurrent, force });
    },
    async app_openAppMenu({ current, appItemCurrent }) {
      const appKey = current.appKey;
      // app default
      await this.app_checkAppMenuDefault({ current, appItemCurrent });
      // app current
      this.navigate(`/a/app/appMenu?appKey=${appKey}`, {
        scene: 'sidebar',
        sceneOptions: this.app_openAppMenu_panelSceneOptions(appKey, appItemCurrent),
        imActive: false,
        panelIndex: this.app_isDefault(appKey) ? 0 : undefined,
      });
    },
    app_isDefault(appKey) {
      return appKey === this.app.keyDefault;
    },
    app_openAppMenu_panelSceneOptions(appKey, appItem) {
      let title;
      let titleLocale;
      let showLabel;
      if (this.app_isDefault(appKey)) {
        title = 'Apps';
        titleLocale = this.$text('Apps');
        showLabel = false;
      } else {
        title = appItem.atomName;
        titleLocale = appItem.atomNameLocale;
        showLabel = true;
      }
      // ok
      return {
        side: 'left',
        name: `appMenu_${appKey}`,
        title,
        titleLocale,
        resourceConfig: {
          showLabel,
          icon: { f7: appItem.appIcon },
        },
        appHome: true,
        appKey,
      };
    },
    async app_checkAppMenuDefault({ current, appItemCurrent }) {
      if (this.app.appMenuDefaultChecked) return;
      // app default
      if (!this.app_isDefault(current.appKey) && !appItemCurrent.isolate) {
        const appItemDefault = await this.$store.dispatch('a/app/getAppItemDefault');
        this.navigate(`/a/app/appMenu?appKey=${this.app.keyDefault}`, {
          scene: 'sidebar',
          sceneOptions: this.app_openAppMenu_panelSceneOptions(this.app.keyDefault, appItemDefault),
          imActive: true,
          panelIndex: 0,
        });
      }
      // checked
      this.app.appMenuDefaultChecked = true;
    },
    async app_openAppHome({ current, appItemCurrent, force }) {
      // configHome
      let configHome;
      let appKey = current.appKey;
      let appIcon = appItemCurrent.appIcon;
      const presetConfigCurrent = await this.$store.dispatch('a/app/getPresetConfigCurrent');
      configHome = presetConfigCurrent.home;
      if (!configHome.mode && force) {
        appKey = this.app.keyDefault;
        const presetConfigDefault = await this.$store.dispatch('a/app/getPresetConfigDefault');
        configHome = presetConfigDefault.home;
        const appItemDefault = await this.$store.dispatch('a/app/getAppItemDefault');
        appIcon = appItemDefault.appIcon;
      }
      if (!configHome.mode) return;
      // navigate
      let url;
      if (configHome.mode === 'dashboard') {
        url = `/a/dashboard/dashboard?key=${configHome.dashboard}`;
      } else {
        url = configHome.page;
      }
      // for unique
      url = this.$meta.util.combineQueries(url, {
        appKey,
        // appLanguage: current.appLanguage, // not set appLanguage
      });
      const navigateOptions = {
        sceneOptions: {
          appHome: true,
          appKey,
          resourceConfig: {
            icon: { f7: appIcon },
          },
        },
      };
      this.navigate(url, navigateOptions);
    },
    async app_openAppMine({ current, force }) {
      if (!current) current = this.$store.getters['a/app/current'];
      // appInfo
      const appKey = current.appKey;
      const appInfo = await this.$store.dispatch('a/user/getAppInfo', { appKey, force });
      if (!appInfo) return;
      // open
      this.navigate('/a/user/user/mine', {
        scene: 'sidebar',
        sceneOptions: this.app_openAppMine_panelSceneOptions(),
        panelIndex: 0,
      });
    },
    app_openAppMine_panelSceneOptions() {
      const title = 'Mine';
      const titleLocale = this.$text('Mine');
      const showLabel = true;
      // ok
      return {
        side: 'right',
        name: 'appMine',
        title,
        titleLocale,
        resourceConfig: {
          showLabel,
        },
        appMine: true,
      };
    },
  },
};
