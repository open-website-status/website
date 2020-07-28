import { WebsiteAPI } from '@/plugins/api';
import { State } from '@/store';
import { Store } from 'vuex';

declare module 'vue/types/vue' {

  interface Vue {
    $typedStore: Store<State>;
    $api: WebsiteAPI;
  }
}
