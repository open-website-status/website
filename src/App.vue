<template>
  <v-app>
    <router-view name="appBar" />
    <v-scroll-x-transition mode="out-in">
      <router-view />
    </v-scroll-x-transition>
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class App extends Vue {

  }
</script>

<style lang="scss">
  .app-bar {
    .avatar {
      cursor: pointer;
    }
  }
</style>
