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
