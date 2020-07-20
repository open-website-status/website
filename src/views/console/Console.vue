<template>
  <v-main>
    <v-progress-circular
      v-if="loading || ($store.state.user !== null && !connected)"
      :size="96"
      indeterminate
      color="primary"
      class="d-block mx-auto my-16"
    />
    <console-not-signed-in
      v-else-if="$store.state.user === null"
    />
    <router-view
      v-else
    />
  </v-main>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import ConsoleNotSignedIn from '@/views/console/ConsoleNotSignedIn.vue';

  @Component({
    components: { ConsoleNotSignedIn },
  })
  export default class Console extends Vue {
    loading = true;
    connected = false;

    @Watch('$store.state.user', {
      immediate: true,
    })
    async onUserChanged (user: firebase.User | null) {
      this.loading = true;
      try {
      if (user) {
        await this.connect();
      } else {
        await this.disconnect();
      }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    }

    async connect () {
      const token = await this.$auth.getIdToken();
      console.log(token);
      this.connected = true;
    }

    async disconnect () {
      this.connected = false;
    }
  }
</script>

<style lang="scss">
  .console-container {
    max-width: 900px;
  }
</style>
