import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import Firebase from 'firebase/app';

Vue.use(Vuex);

Object.defineProperty(Vue.prototype, '$typedStore', {
  get (): Store<State> {
    return this.$store;
  },
});

export interface State {
  user: Firebase.User | null;
}

export default new Vuex.Store<State>({
  state: {
    user: null,
  },
  mutations: {
    setUser (state, user: Firebase.User | null): void {
      state.user = user === null ? null : { ...user };
    },
  },
  actions: {
  },
  modules: {
  },
});
