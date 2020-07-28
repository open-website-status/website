import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { Job } from '@open-website-status/api';

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
  jobs: Record<string, Job[] | undefined>;
}

export interface SetJobsOptions {
  queryId: string;
  jobs: Job[];
}

export default new Vuex.Store<State>({
  state: {
    connected: false,
    apiConnectionError: false,
    apiError: null,
    connectedProvidersCount: null,
    jobs: {},
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
    setJobs (state, { queryId, jobs }: SetJobsOptions) {
      Vue.set(state.jobs, queryId, jobs);
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
