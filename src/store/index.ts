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
  connectedProvidersCount: number | null;
}

export default new Vuex.Store<State>({
  state: {
    connected: false,
    apiConnectionError: false,
    apiError: null,
    connectedProvidersCount: null,
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
    setConnectedProvidersCount (state, connectedProvidersCount: number | null) {
      state.connectedProvidersCount = connectedProvidersCount;
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
      context.commit('setConnectedProvidersCount', null);
    },
    resetErrors (context) {
      context.commit('setAPIConnectionError', false);
      context.commit('setAPIError', null);
    },
  },
  modules: {
  },
});
