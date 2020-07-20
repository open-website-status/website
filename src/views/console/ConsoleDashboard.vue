<template>
  <v-container class="console-dashboard-container console-container fill-height d-flex flex-column">
    <v-breadcrumbs
      :items="breadcrumbs"
      class="align-self-start"
    />
    <v-spacer />
    <div class="d-flex flex-column fill-width">
      <console-dashboard-account-card class="mt-16 align-self-center" />
    </div>
    <div class="fill-width pb-12">
      <v-row
        class="mx-0 mx-sm-12 mt-12"
      >
        <v-col cols="6">
          <v-card
            class="d-flex flex-column align-center"
            color="primary"
            to="/console/api-clients"
          >
            <v-icon
              :size="$vuetify.breakpoint.mdAndUp ? 96 : 64"
              class="mt-4"
            >
              mdi-key
            </v-icon>
            <v-card-title>
              API clients
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card
            class="d-flex flex-column align-center"
            color="primary"
            to="/console/providers"
          >
            <v-icon
              :size="$vuetify.breakpoint.mdAndUp ? 96 : 64"
              class="mt-4"
            >
              mdi-server
            </v-icon>
            <v-card-title>
              Providers
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-spacer />
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import ConsoleDashboardAccountCard from '@/components/ConsoleDashboardAccountCard.vue';

  @Component({
    components: {
      ConsoleDashboardAccountCard,
    },
  })
  export default class ConsoleDashboard extends Vue {
    breadcrumbs = [
      {
        text: 'Open Website Status',
        to: '/',
        exact: true,
      },
      {
        text: 'Console',
        to: '/console',
        exact: true,
      },
    ];
  }
</script>

<style lang="scss">
  .console-dashboard-container {
    .avatar-wrapper {
      margin-top: -64px;

      .avatar {
        border: 1px solid #444;
      }
    }

    .fill-width {
      width: 100%;
    }
  }
</style>
