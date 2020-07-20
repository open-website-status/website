import Vue from 'vue';
import Vuex from 'vuex';
import Firebase from 'firebase/app';

Vue.use(Vuex);

export default new Vuex.Store<{
  user: Firebase.User | null;
}>({
  state: {
    user: null,
  },
  mutations: {
    setUser (state, user: Firebase.User | null): void {
      state.user = user;
    },
  },
  actions: {
  },
  modules: {
  },
});
