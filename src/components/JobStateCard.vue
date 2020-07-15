<template>
  <v-card
    outlined
    class="job-state-card d-flex flex-column"
  >
    <v-card-title>
      Job state
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            class="info-button"
            v-on="on"
          >
            <v-icon>
              mdi-information
            </v-icon>
          </v-btn>
        </template>
        <v-list
          dense
          color="grey darken-3"
        >
          <v-list-item
            v-for="(item, i) in jobStates"
            :key="i"
          >
            <v-sheet
              :color="item.color"
              height="24"
              rounded
              class="mr-3 px-2"
            >
              {{ item.data }}
            </v-sheet>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.label }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="item.description">
                {{ item.description }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-divider />
    <v-spacer />
    <div
      v-if="jobCount === 0"
      class="text-center text-subtitle-1 my-6 mx-4 text--secondary"
    >
      No jobs
    </div>
    <div
      v-else
      class="pa-4 pa-md-2 mx-auto job-state-chart-wrapper"
    >
      <pie-chart
        :data="jobStates"
      />
    </div>
    <v-spacer />
  </v-card>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import PieChart from './PieChart.vue';
  import { JobStateItem } from '@/types';
  import _ from 'lodash';

  @Component({
    components: {
      PieChart,
    },
  })
  export default class JobStateCard extends Vue {
    @Prop({ required: true, type: Array })
    readonly jobStates!: JobStateItem[];

    get jobCount () {
      return _.sumBy(this.jobStates, 'data');
    }
  }
</script>

<style lang="scss">
  .job-state-card {
    .info-button {
      margin-top: -8px;
      margin-bottom: -8px;
    }

    .job-state-chart-wrapper {
      max-width: 250px;
      width: 100%;
    }
  }
</style>
