<template>
  <v-list-item
    link
    class="align-center"
  >
    <v-card
      v-if="job.jobState === 'dispatched'"
      outlined
      class="d-flex px-2 py-1 text-body-2"
    >
      Dispatched
    </v-card>
    <v-card
      v-else-if="job.jobState === 'accepted'"
      outlined
      class="d-flex px-2 py-1 text-body-2"
    >
      Accepted
    </v-card>
    <v-card
      v-else-if="job.jobState === 'rejected'"
      outlined
      class="d-flex px-2 py-1 text-body-2"
    >
      Rejected
    </v-card>
    <v-card
      v-else-if="job.jobState === 'canceled'"
      outlined
      class="d-flex px-2 py-1 text-body-2"
    >
      Canceled
    </v-card>
    <v-card
      v-else-if="job.result.state === 'success'"
      outlined
      class="d-flex px-2 text-body-2 fit-content text-no-wrap overflow-x-hidden"
    >
      <div
        :class="`py-1 ${httpStatusDetails.color}--text`"
        v-text="httpStatusDetails.code"
      />
      <v-divider
        vertical
        class="fill-height d-inline-block mx-2"
      />
      <div
        class="py-1 text-truncate"
        v-text="httpStatusDetails.httpText"
      />
    </v-card>
    <v-card
      v-else-if="job.result.state === 'error'"
      outlined
      class="d-flex px-2 text-body-2"
      color="red"
    >
      <div class="py-1">
        Error
      </div>
      <v-divider
        vertical
        class="fill-height d-inline-block mx-2"
      />
      <div
        class="py-1"
        v-text="job.result.errorCode"
      />
    </v-card>
    <v-card
      v-else-if="job.result.state === 'timeout'"
      outlined
      class="d-flex px-2 py-1 text-body-2"
      color="amber black--text"
    >
      Timeout
    </v-card>
    <v-spacer />
    <div
      v-if="executionTimeString !== null"
      class="ml-2 ml-sm-4 text-no-wrap"
      :class="{
        'amber--text': job.result.state === 'timeout'
      }"
    >
      {{ executionTimeString }} s
    </div>
    <div class="ml-2 ml-sm-4">
      <v-img
        :src="`https://www.countryflags.io/${job.countryCode}/flat/64.png`"
        width="24px"
      />
    </div>
  </v-list-item>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { FullJob } from '@/types';
  import * as iso3166 from 'iso-3166-2';
  import HttpStatus from 'http-status-codes';

  @Component
  export default class QueryDetailsJobItem extends Vue {
    @Prop({ required: true, type: Object })
    readonly job!: FullJob;

    get subdivision (): iso3166.SubdivisionInfo.Full | null {
      return iso3166.subdivision(this.job.countryCode, this.job.regionCode);
    }

    get httpStatusDetails (): { code: number; color: string; httpText: string | undefined } | null {
      if (this.job.jobState !== 'completed' || this.job.result.state !== 'success') return null;

      const code = this.job.result.httpCode;

      let color: string;

      if (code < 100 || code >= 600) color = 'blue-grey darken-3';
      else if (code <= 199) color = 'white black--text';
      else if (code <= 299) color = 'green';
      else if (code <= 399) color = 'yellow black--text';
      else if (code <= 499) color = 'red';
      else color = 'red darken-3';

      let httpText: string | undefined;

      try {
        httpText = HttpStatus.getStatusText(code);
      } catch (error) {
        httpText = undefined;
      }

      return {
        code,
        color,
        httpText,
      };
    }

    get executionTimeString (): string | null {
      if (this.job.jobState !== 'completed' || this.job.result.state === 'error') return null;

      return (this.job.result.executionTime / 1000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }
</script>
