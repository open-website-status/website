<template>
  <v-container
    class="fill-height align-center justify-center flex-column text-center"
  >
    <template v-if="$typedStore.state.apiError !== null">
      <v-icon
        size="96"
        color="error"
      >
        mdi-alert-circle
      </v-icon>
      <h4 class="text-h4 mt-8">
        There was an error
      </h4>
      <h5
        class="text-h5 mt-4"
        v-text="$typedStore.state.apiError"
      />
      <v-btn
        class="mt-12"
        outlined
        large
        width="200px"
        min-width="fit-content"
        max-width="100%"
        rounded
        @click="$api.reconnect()"
      >
        Try again
      </v-btn>
    </template>
    <template v-else>
      <v-progress-circular
        indeterminate
        :size="96"
        color="primary"
      />
      <h1 class="text-h4 mt-12">
        Connecting...
      </h1>
      <v-alert
        class="mt-12"
        icon="mdi-alert-circle"
        color="error"
        border="left"
        text
        :value="$typedStore.state.apiConnectionError"
      >
        Cannot connect with server
      </v-alert>
    </template>
  </v-container>
</template>

<script>
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class NotConnectedContainer extends Vue {

  }
</script>
