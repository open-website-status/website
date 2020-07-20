<template>
  <v-container class="console-dashboard-container console-container fill-height d-flex flex-column">
    <v-breadcrumbs
      :items="breadcrumbs"
      class="align-self-start"
    />
    <v-spacer />
    <div class="d-flex flex-column fill-width">
      <v-card
        outlined
        class="mt-16 align-self-center text-center"
        width="480"
      >
        <div class="d-flex justify-center avatar-wrapper">
          <v-avatar
            :size="128"
            class="avatar elevation-8"
          >
            <v-img :src="$store.state.user.photoURL">
              <template v-slot:placeholder>
                <v-sheet
                  color="grey darken-4"
                  class="fill-height"
                >
                  <v-icon :size="80">
                    mdi-account-circle
                  </v-icon>
                </v-sheet>
              </template>
            </v-img>
          </v-avatar>
        </div>
        <v-card-title
          class="d-block"
          v-text="$store.state.user.displayName"
        />
        <v-card-subtitle
          class="pb-0"
          v-text="$store.state.user.email"
        />
        <v-card-actions class="my-2 mx-4">
          <v-btn
            outlined
            rounded
            large
            block
            @click="$auth.signOut"
          >
            Sign out
          </v-btn>
        </v-card-actions>
      </v-card>
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

  @Component
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
