import _Vue from 'vue';
import { Job, OpenWebsiteStatusAPI, Query, WebsiteQueryMessage } from '@open-website-status/api';
import store from '../../store';
import _ from 'lodash';

export type OnJobListThrottledFunction = ((queryId: string, jobs: Job[]) => void) & _.Cancelable;

export class WebsiteAPI {
  private api = new OpenWebsiteStatusAPI({
    server: process.env.VUE_APP_SERVER_URL,
  });

  private onJobListThrottled = new Map<string, OnJobListThrottledFunction>();

  constructor () {
    this.api.onConnect(async () => {
      await store.dispatch('connect');
    });

    this.api.onDisconnect(async () => {
      await store.dispatch('disconnect');
    });

    this.api.onConnectError((error) => {
      console.error(error);
      store.commit('setAPIConnectionError', true);
    });

    this.api.onError((error: string) => {
      store.commit('setAPIError', error);
    });

    this.api.onConnectedProvidersCount((count) => {
      store.commit('setConnectedProvidersCount', count);
    });

    this.api.onJobList((queryId, jobs) => this.throttleOnJobList(queryId, jobs));

    this.api.onQueryCreate((query) => {
      store.commit('addHostnameQuery', query);
    });
  }

  private throttleOnJobList (queryId: string, jobs: Job[]) {
    let throttle = this.onJobListThrottled.get(queryId);
    if (throttle === undefined) {
      throttle = _.throttle(WebsiteAPI.onJobList, 500, {
        leading: true,
        trailing: true,
      });
      this.onJobListThrottled.set(queryId, throttle);
    }
    throttle(queryId, jobs);
  }

  private static onJobList (queryId: string, jobs: Job[]) {
    store.commit('setJobs', {
      queryId,
      jobs,
    });
  }

  public async reconnect (): Promise<void> {
    await store.dispatch('disconnect');
    await store.dispatch('resetErrors');
    this.api.reconnect();
  }

  public query (data: WebsiteQueryMessage): Promise<Query> {
    return this.api.queryWebsite(data);
  }

  public getQuery (id: string, subscribe: boolean): Promise<Query> {
    return this.api.getQuery({
      queryId: id,
      subscribe,
    });
  }

  public async getHostnameQueries (hostname: string, subscribe: boolean): Promise<Query[]> {
    const queries = await this.api.getHostnameQueries({
      hostname,
      subscribe,
    });
    store.commit('setHostnameQueries', {
      hostname,
      queries,
    });
    return queries;
  }
}

export default {
  install (Vue: typeof _Vue) {
    Vue.prototype.$api = new WebsiteAPI();
  },
};
