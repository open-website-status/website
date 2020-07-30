<template>
  <v-app-bar
    app
    class="app-bar"
  >
    <router-link
      v-ripple
      to="/"
      class="title-link"
      exact
    >
      <v-toolbar-title class="d-flex align-center">
        <v-img
          :src="require('../assets/logo.svg')"
          contain
          class="mr-4"
          width="32"
        />
        Open Website Status
      </v-toolbar-title>
    </router-link>
    <v-spacer />
    <v-btn
      v-if="$vuetify.breakpoint.smAndUp"
      :href="consoleHref"
      outlined
      rounded
    >
      Open console
    </v-btn>
    <v-btn
      v-else
      :href="consoleHref"
      outlined
      rounded
      small
    >
      Console
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class MainAppBar extends Vue {
    get consoleHref () {
      return process.env.VUE_APP_CONSOLE_HREF;
    }
  }
</script>

<style lang="scss">
  .app-bar {
    .title-link {
      text-decoration: inherit;
      color: inherit;
      margin-left: -6px;
      margin-right: -6px;
      padding: 6px;
      border-radius: 3px;
    }
  }
</style>
