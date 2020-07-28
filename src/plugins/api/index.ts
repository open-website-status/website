import _Vue from 'vue';
import { OpenWebsiteStatusAPI, Query, WebsiteQueryMessage } from '@open-website-status/api';
import store from '../../store';

export class WebsiteAPI {
  private api = new OpenWebsiteStatusAPI({
    server: process.env.VUE_APP_SERVER_URL,
  });

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

    this.api.onJobList((queryId, jobs) => {
      store.commit('setJobs', {
        queryId,
        jobs,
      });
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
}

export default {
  install (Vue: typeof _Vue) {
    Vue.prototype.$api = new WebsiteAPI();
  },
};
