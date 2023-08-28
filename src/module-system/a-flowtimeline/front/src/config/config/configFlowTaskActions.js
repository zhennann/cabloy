const actions = {
  claim: {
    basic: true,
    title: 'TaskActionTitleClaim',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { f7: '::mark-as-unread' },
  },
  viewAtom: {
    basic: true,
    title: 'View',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { f7: '::visibility' },
  },
  handleTask: {
    basic: true,
    title: 'Handle',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { f7: '::play-arrow' },
  },
  cancelFlow: {
    basic: true,
    title: 'Cancel Flow',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { f7: '::stop' },
  },
  assigneesConfirmation: {
    basic: true,
    title: 'Confirmation',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { f7: '::group' },
  },
  recall: {
    basic: true,
    title: 'Recall',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { f7: '::undo' },
  },
  appendHandleRemark: {
    basic: false,
    title: 'AppendHandleRemark',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { f7: '::info-circle' },
  },
  forward: {
    basic: false,
    title: 'TaskActionTitleForward',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
  },
  forwardRecall: {
    basic: false,
    title: 'TaskActionTitleForwardRecall',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { f7: '::undo' },
  },
  substitute: {
    basic: false,
    title: 'TaskActionTitleSubstitute',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
  },
  substituteRecall: {
    basic: false,
    title: 'TaskActionTitleSubstituteRecall',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { f7: '::undo' },
  },
};
export default actions;
