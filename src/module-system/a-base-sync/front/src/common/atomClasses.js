export default {
  computed: {
    atomClassesAll() {
      return this.$store.getState('a/base/atomClasses');
    },
  },
  methods: {
    getAtomClass(atomClass) {
      if (!this.atomClassesAll || !atomClass) return null;
      return this.atomClassesAll[atomClass.module][atomClass.atomClassName];
    },
  },
  created() {
    this.$store.dispatch('a/base/getAtomClasses').then(() => {
      this.onAtomClassesReady && this.onAtomClassesReady();
    });
  },
};

