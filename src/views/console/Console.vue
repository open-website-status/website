<template>
  <v-main>
    <div
      v-if="loading || ($typedStore.state.user !== null && !connected)"
      class="d-flex fill-height align-center justify-center"
    >
      <v-progress-circular
        :size="96"
        indeterminate
        color="primary"
        class="d-block mx-auto my-16"
      />
    </div>
    <console-not-signed-in
      v-else-if="$typedStore.state.user === null"
    />
    <router-view
      v-else
      :providers="providers"
      :api-clients="apiClients"
      :create-provider-function="createProvider"
      :rename-provider-function="renameProvider"
      :reset-provider-token-function="resetProviderToken"
      :create-api-client-function="createAPIClient"
      :rename-api-client-function="renameAPIClient"
      :reset-api-client-token-function="resetAPIClientToken"
    />
  </v-main>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import ConsoleNotSignedIn from '@/views/console/ConsoleNotSignedIn.vue';
  import ConsoleSocket from '@/sockets/console';
  import { Listener } from 'typed-event-emitter';
  import { APIClient, Provider } from '@/sockets/types';

  @Component({
    components: { ConsoleNotSignedIn },
  })
  export default class Console extends Vue {
    loading = true;
    connected = false;
    socket: ConsoleSocket | null = null;
    socketListeners = new Array<Listener>();
    providers: Provider[] | null = null;
    apiClients: APIClient[] | null = null;

    @Watch('$typedStore.state.user', {
      immediate: true,
    })
    async onUserChanged (user: firebase.User | null, oldUser: firebase.User | null) {
      this.loading = true;
      try {
        if (user !== null && oldUser?.uid !== user.uid) {
          await this.connect();
        } else if (oldUser === null) {
          await this.disconnect();
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    }

    async connect () {
      const token = await this.$auth.getIdToken();
      this.socketListeners.forEach((listener) => listener.unbind());
      this.socket?.close();
      this.socket = new ConsoleSocket(token);
      this.socketListeners = [
        this.socket.onConnect(this.onConnect),
        this.socket.onDisconnect(this.onDisconnect),
        this.socket.onProviderList(this.onProviderList),
        this.socket.onAPIClientList(this.onAPIClientList),
      ];
    }

    disconnect () {
      this.connected = false;
      this.socketListeners.forEach((listener) => listener.unbind());
      this.socketListeners = [];
      this.socket?.close();
      this.socket = null;
    }

    onConnect () {
      this.connected = true;
    }

    onDisconnect () {
      this.connected = false;
      this.providers = null;
      this.apiClients = null;
    }

    onProviderList (providers: Provider[]) {
      this.providers = providers;
    }

    onAPIClientList (apiClients: APIClient[]) {
      this.apiClients = apiClients;
    }

    beforeDestroy () {
      this.disconnect();
    }

    async createProvider (name: string, reCaptchaResponse: string) {
      if (this.socket === null || !this.connected) throw new Error('Socket not connected');
      return await this.socket.createProvider(name, reCaptchaResponse);
    }

    async renameProvider (id: string, name: string) {
      if (this.socket === null || !this.connected) throw new Error('Socket not connected');
      return await this.socket.renameProvider(id, name);
    }

    async resetProviderToken (id: string) {
      if (this.socket === null || !this.connected) throw new Error('Socket not connected');
      return await this.socket.resetProviderToken(id);
    }

    async createAPIClient (name: string, reCaptchaResponse: string) {
      if (this.socket === null || !this.connected) throw new Error('Socket not connected');
      return await this.socket.createAPIClient(name, reCaptchaResponse);
    }

    async renameAPIClient (id: string, name: string) {
      if (this.socket === null || !this.connected) throw new Error('Socket not connected');
      return await this.socket.renameAPIClient(id, name);
    }

    async resetAPIClientToken (id: string) {
      if (this.socket === null || !this.connected) throw new Error('Socket not connected');
      return await this.socket.resetAPIClientToken(id);
    }
  }
</script>

<style lang="scss">
  .console-container {
    max-width: 900px;
  }
</style>
