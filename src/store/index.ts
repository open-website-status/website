import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { Job, Query } from '@open-website-status/api';

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
  hostnameQueries: Record<string, Query[] | undefined>;
}

export interface SetJobsOptions {
  queryId: string;
  jobs: Job[];
}

export interface SetHostnameQueriesOptions {
  hostname: string;
  queries: Query[];
}

export default new Vuex.Store<State>({
  state: {
    connected: false,
    apiConnectionError: false,
    apiError: null,
    connectedProvidersCount: null,
    jobs: {},
    hostnameQueries: {},
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
    resetJobs (state) {
      state.jobs = {};
    },
    setHostnameQueries (state, { hostname, queries }: SetHostnameQueriesOptions) {
      Vue.set(state.hostnameQueries, hostname, queries);
    },
    addHostnameQuery (state, query: Query) {
      const hostnameQueries = state.hostnameQueries[query.hostname];
      if (hostnameQueries === undefined) {
        Vue.set(state.jobs, query.id, [query]);
      } else {
        hostnameQueries.push(query);
      }
    },
    resetHostnameQueries (state) {
      state.hostnameQueries = {};
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
      context.commit('resetJobs');
      context.commit('resetHostnameQueries');
    },
    resetErrors (context) {
      context.commit('setAPIConnectionError', false);
      context.commit('setAPIError', null);
    },
  },
  modules: {
  },
});
