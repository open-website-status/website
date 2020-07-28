import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

Object.defineProperty(Vue.prototype, '$typedStore', {
  get (): Store<State> {
    return this.$store;
  },
});

export interface State {
  connected: boolean;
  apiConnectionError: boolean;
  apiError: string | null;
}

export default new Vuex.Store<State>({
  state: {
    connected: false,
    apiConnectionError: false,
    apiError: null,
  },
  mutations: {
    setConnected (state, connected: boolean): void {
      state.connected = connected;
    },
    setAPIConnectionError (state, error: boolean): void {
      state.apiConnectionError = error;
    },
    setAPIError (state, error: string | null): void {
      state.apiError = error;
    },
  },
  actions: {
    connect (context) {
      context.commit('setConnected', true);
      context.commit('setAPIConnectionError', false);
      context.commit('setAPIError', null);
    },
    disconnect (context) {
      context.commit('setConnected', false);
    },
    resetErrors (context) {
      context.commit('setAPIConnectionError', false);
      context.commit('setAPIError', null);
    },
  },
  modules: {
  },
});
