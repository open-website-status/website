import _Vue from 'vue';
import { OpenWebsiteStatusAPI } from '@open-website-status/api';
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
  }

  public async reconnect (): Promise<void> {
    await store.dispatch('disconnect');
    await store.dispatch('resetErrors');
    this.api.reconnect();
  }
}

export default {
  install (Vue: typeof _Vue) {
    Vue.prototype.$api = new WebsiteAPI();
  },
};
