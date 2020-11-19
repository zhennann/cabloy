import Vue from 'vue';
export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      const flowLayoutManager = item.flowLayoutManager;
      const task = item.task;
      const flowTaskId = task.flowTaskId;
      if (action.name === 'viewAtom') {
        return await this._viewAtom({ ctx, action, flowLayoutManager, task, flowTaskId });
      } else if (action.name === 'assigneesConfirmation') {
        return await this._assigneesConfirmation({ ctx, action, flowLayoutManager, task, flowTaskId });
      } else if (action.name === 'cancelFlow') {
        return await this._cancelFlow({ ctx, action, flowLayoutManager, task, flowTaskId });
      } else if (action.name === 'handleTask') {
        return await this._handleTask({ ctx, action, flowLayoutManager, task, flowTaskId });
      }
    },
    async _viewAtom({ ctx, flowLayoutManager, task, flowTaskId }) {
      // load schema and item
      if (!task._viewAtomData) {
        const data = await ctx.$api.post('/a/flowtask/task/viewAtom', {
          flowTaskId,
        });
        Vue.set(task, '_viewAtomData', data);
      }
      // navigate
      ctx.$view.navigate(`/a/flowtask/flowTaskAtom?flowTaskId=${flowTaskId}&mode=view`, {
        context: {
          params: {
            flowLayoutManager,
            task,
            data: task._viewAtomData,
          },
        },
      });
    },
    async _assigneesConfirmation({ ctx, flowLayoutManager, flowTaskId }) {
      // assignees
      const assignees = await ctx.$api.post('/a/flowtask/task/assignees', {
        flowTaskId,
      });
      // navigate
      ctx.$view.navigate(`/a/flowtask/assigneesConfirmation?flowTaskId=${flowTaskId}`, {
        context: {
          params: {
            flowTaskId,
            assignees,
          },
          callback: code => {
            if (code === 200) {
              flowLayoutManager.base_loadData().then(() => {});
            }
          },
        },
      });
    },
    async _cancelFlow({ ctx, flowLayoutManager, flowTaskId }) {
      await ctx.$view.dialog.confirm(this.$text('CancelFlowPrompt'));
      await ctx.$api.post('/a/flowtask/task/cancelFlow', {
        flowTaskId,
        handle: {
          remark: 'Cancelled',
        },
      });
      await flowLayoutManager.base_loadData();
    },
    async _handleTask({ ctx, action, flowLayoutManager, task, flowTaskId }) {
    },
  },
};
