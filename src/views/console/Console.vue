<template>
  <v-main>
    <!--    <v-navigation-drawer-->
    <!--      app-->
    <!--      permanent-->
    <!--      color="grey darken-4"-->
    <!--    >-->
    <!--      <div class="my-6">-->
    <!--        <v-list-item>-->
    <!--          <v-list-item-avatar>-->
    <!--            <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" />-->
    <!--          </v-list-item-avatar>-->

    <!--          <v-list-item-content>-->
    <!--            <v-list-item-title>-->
    <!--              Username-->
    <!--            </v-list-item-title>-->
    <!--            <v-list-item-subtitle>-->
    <!--              email@example.com-->
    <!--            </v-list-item-subtitle>-->
    <!--          </v-list-item-content>-->
    <!--        </v-list-item>-->
    <!--        <div class="mx-4 mt-2">-->
    <!--          <v-btn-->
    <!--            block-->
    <!--            outlined-->
    <!--            rounded-->
    <!--          >-->
    <!--            Sign out-->
    <!--          </v-btn>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <v-divider />-->
    <!--      <v-list-->
    <!--        shaped-->
    <!--      >-->
    <!--        <v-list-item-->
    <!--          v-for="route in routes"-->
    <!--          :key="route.to"-->
    <!--          :to="route.to"-->
    <!--          color="primary"-->
    <!--          exact-->
    <!--        >-->
    <!--          <v-list-item-icon>-->
    <!--            <v-icon>{{ route.icon }}</v-icon>-->
    <!--          </v-list-item-icon>-->
    <!--          <v-list-item-content>-->
    <!--            <v-list-item-title v-text="route.title" />-->
    <!--          </v-list-item-content>-->
    <!--        </v-list-item>-->
    <!--      </v-list>-->
    <!--    </v-navigation-drawer>-->
    <router-view />
  </v-main>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class Console extends Vue {
    routes = [
      {
        to: '/',
        icon: 'mdi-arrow-left',
        title: 'Go back',
      },
      {
        to: '/console',
        icon: 'mdi-view-dashboard',
        title: 'Console dashboard',
      },
      {
        to: '/console/api-clients',
        icon: 'mdi-key',
        title: 'API clients',
      },
      {
        to: '/console/providers',
        icon: 'mdi-server',
        title: 'Providers',
      },
    ]

    get breadcrumbs () {
      return [
        {
          text: 'Open Website Status',
          disabled: false,
          to: '/',
          exact: true,
        },
        {
          text: 'Console',
          disabled: false,
          to: '/console',
          exact: true,
        },
        {
          text: 'API Clients',
          to: '/console/api-clients',
          exact: true,
        },
      ];
    }
  }
</script>

<style lang="scss">
  .console-container {
    max-width: 900px;
  }
</style>
