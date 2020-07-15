<template>
  <v-card
    outlined
    class="d-flex flex-column"
  >
    <v-card-title>
      Execution time
    </v-card-title>
    <v-divider />
    <template v-if="timeoutCount > 0">
      <v-card-text>
        <v-alert
          color="amber"
          text
          border="left"
          class="mb-0"
        >
          {{ timeoutCount }}
          {{ timeoutCount === 1 ? 'timeout' : 'timeouts' }}
        </v-alert>
      </v-card-text>
      <v-divider />
    </template>
    <v-spacer />
    <v-card-text
      v-if="averageTimeString !== null"
      class="text--primary"
    >
      <div class="text-center subtitle-1">
        Average time:
      </div>
      <h4 class="text-center text-h3 font-weight-thin">
        {{ averageTimeString }} s
      </h4>
      <execution-time-chart
        :data="executionTimes"
        class="mt-2"
      />
    </v-card-text>
    <div
      v-else
      class="text-center text-subtitle-1 my-6 mx-4 text--secondary"
    >
      No responses
    </div>
    <v-spacer />
  </v-card>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import ExecutionTimeChart from '@/components/ExecutionTimeChart.vue';
  import _ from 'lodash';

  @Component({
    components: {
      ExecutionTimeChart,
    },
  })
  export default class ExecutionTimeCard extends Vue {
    @Prop({ required: true, type: Number })
    readonly timeoutCount!: number;

    @Prop({ required: true, type: Array })
    readonly executionTimes!: number[];

    get averageTime (): null | number {
      if (this.executionTimes.length === 0) return null;
      return _.mean(this.executionTimes);
    }

    get averageTimeString (): null | string {
      if (this.averageTime === null) return null;

      return (this.averageTime / 1000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }
</script>
