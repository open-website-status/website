<template>
  <v-app-bar
    app
    class="app-bar"
  >
    <v-btn
      v-if="$route.name !== 'Home'"
      icon
      to="/"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title>Open Website Status</v-toolbar-title>
    <v-spacer />
    <v-btn
      v-if="$vuetify.breakpoint.smAndUp"
      to="/console"
      outlined
      rounded
    >
      Open console
    </v-btn>
    <v-btn
      v-else
      to="/console"
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

  }
</script>
