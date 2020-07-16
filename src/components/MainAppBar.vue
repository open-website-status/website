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
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-avatar
          v-ripple
          class="avatar"
          :size="$vuetify.breakpoint.smAndDown ? 32 : undefined"
          v-on="on"
        >
          <img
            src="https://cdn.vuetifyjs.com/images/john.jpg"
            alt="John"
          >
        </v-avatar>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>
              mdi-logout
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Sign out
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class MainAppBar extends Vue {

  }
</script>
