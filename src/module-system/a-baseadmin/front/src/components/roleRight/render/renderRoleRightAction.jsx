import Vue from 'vue';
const ebValidateComponentBase = Vue.prototype.$meta.module.get('a-components').options.mixins.ebValidateComponentBase;

export default {
  mixins: [ebValidateComponentBase],
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      atomClass: null,
      atomClassBase: null,
      actionsBase: null,
      actionsUser: null,
      actionSelectOptions: null,
    };
  },
  computed: {
    ready() {
      return this.atomClass && this.atomClassBase && this.actionsBase && this.actionsUser && this.actionSelectOptions;
    },
    atomMain() {
      const { validate } = this.context;
      return validate.host.atomMain;
    },
    atomClassIdTarget() {
      return this.context.getValue('atomClassIdTarget');
    },
    value() {
      return this.context.getValue();
    },
    actionBaseCurrent() {
      const actionBaseCurrent = this.__getActionBaseCurrent();
      return actionBaseCurrent;
    },
    actionCurrentDescription() {
      const actionBase = this.actionBaseCurrent;
      if (!actionBase) {
        return null;
      }
      if (actionBase.bulk && actionBase.code !== 1) {
        return this.$text('Bulk Actions');
      }
      if (actionBase.actionMode === 1) {
        return `${this.$text('WorkFlow Actions')}: ${actionBase.flowDefNameLocale}`;
      }
      return null;
    },
  },
  watch: {
    atomClassIdTarget: {
      handler(newValue) {
        this.__atomClassIdTargetChanged(newValue);
      },
      immediate: false, // true,
    },
  },
  created() {
    this.__loadActionSelectOptions();
  },
  methods: {
    __getActionBaseCurrent() {
      const actionCode = this.value;
      if (!this.ready || !actionCode) return null;
      // normal
      const actionName = Object.keys(this.actionsBase).find(key => this.actionsBase[key].code === actionCode);
      if (actionName) {
        return this.actionsBase[actionName];
      }
      // flow
      return this.actionsUser.find(item => item.action === parseInt(actionCode));
    },
    async __atomClassIdTargetChanged() {
      this.context.setValue(null);
      await this.__loadActionSelectOptions();
    },
    async __loadActionSelectOptions() {
      // clear
      this.atomClassBase = null;
      this.atomClass = null;
      this.actionsBase = null;
      this.actionsUser = null;
      this.actionSelectOptions = null;
      // check
      if (!this.atomClassIdTarget) {
        return;
      }
      // atomClassBase
      const useStoreAtomClasses = await this.$store.use('a/basestore/atomClasses');
      this.atomClassBase = await useStoreAtomClasses.getAtomClassBase({
        atomClass: { id: this.atomClassIdTarget },
      });
      this.atomClass = {
        module: this.atomClassBase.module,
        atomClassName: this.atomClassBase.atomClassName,
      };
      // actionsBase
      const useStoreAtomActions = await this.$store.use('a/basestore/atomActions');
      this.actionsBase = await useStoreAtomActions.getActionsBase({
        atomClass: this.atomClass,
      });
      // actionsUser
      const actionsUser = await this.$api.post('/a/base/atomClass/actionsUser', {
        atomClass: this.atomClass,
      });
      // normal
      const [groupAtom, groupBulk] = await this.__loadActionSelectOptions_normal({ actionsUser });
      // flow
      const groupFlows = await this.__loadActionSelectOptions_flow({ actionsUser });
      // ok
      this.actionsUser = actionsUser;
      this.actionSelectOptions = [groupAtom, groupBulk].concat(groupFlows);
    },
    async __loadActionSelectOptions_normal({ actionsUser }) {
      //
      const actionsBase = this.actionsBase;
      //
      const groupAtom = { title: 'Atom Actions', options: [] };
      const groupBulk = { title: 'Bulk Actions', options: [] };
      // atom/bulk
      for (const key in actionsBase) {
        const actionBase = actionsBase[key];
        if (!actionsUser.find(item => item.action === actionBase.code)) continue;
        if (actionBase.authorize === false) continue;
        const option = { title: actionBase.titleLocale, value: actionBase.code };
        if (actionBase.code === 1 || !actionBase.bulk) {
          groupAtom.options.push(option);
        } else {
          groupBulk.options.push(option);
        }
      }
      return [groupAtom, groupBulk];
    },
    async __loadActionSelectOptions_flow({ actionsUser }) {
      //
      const groupFlows = [];
      //
      const actionsFlow = actionsUser
        .filter(item => item.actionMode === 1)
        .sort((a, b) => {
          const locale = this.$meta.util.getLocale();
          return a.flowDefNameLocale.localeCompare(b.flowDefNameLocale, locale);
        })
        .group(item => item.flowDefNameLocale);
      //
      for (const flowDefNameLocale in actionsFlow) {
        const actions = actionsFlow[flowDefNameLocale];
        const groupFlow = { title: `${this.$text('WorkFlow Actions')}: ${flowDefNameLocale}`, options: [] };
        for (const action of actions) {
          const option = { title: action.nameLocale, value: action.action };
          groupFlow.options.push(option);
        }
        groupFlows.push(groupFlow);
      }
      return groupFlows;
    },
  },
  render() {
    if (!this.atomClassIdTarget) return null;
    const { dataPath, key, property, validate } = this.context;
    const actionBaseCurrent = this.actionBaseCurrent;
    const actionTitle = actionBaseCurrent?.titleLocale || actionBaseCurrent?.nameLocale;
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after">{actionTitle}</div>
        </f7-list-item>
      );
    }
    //
    const attrs = {
      name: key,
      dataPath,
      value: this.value,
      readOnly: false,
      options: this.actionSelectOptions,
    };
    return (
      <f7-list-item class="item" smartSelect smartSelectParams={{ openIn: 'page', closeOnSelect: true }}>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="root-end" class="summary-no-media text-align-right">
          {this.actionCurrentDescription}
        </div>
        <eb-select
          {...{ props: attrs }}
          onInput={value => {
            this.context.setValue(value);
          }}
        ></eb-select>
      </f7-list-item>
    );
  },
};
