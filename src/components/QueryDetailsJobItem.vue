<template>
  <v-bottom-sheet
    inset
    width="512"
    overlay-color="white"
    :overlay-opacity="0.1"
    scrollable
  >
    <template v-slot:activator="{ on }">
      <v-list-item
        class="align-center"
        v-on="on"
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
            :class="`py-1 ${httpStatusDetails.textColor}`"
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
          class="px-2 py-1 text-body-2"
          color="amber black--text"
        >
          Timeout
        </v-card>
        <v-spacer />
        <div
          v-if="executionTimeString !== undefined"
          class="ml-2 ml-sm-4 text-no-wrap"
          :class="{
            'amber--text': job.result.state === 'timeout'
          }"
        >
          {{ executionTimeString }} s
        </div>
        <div class="ml-2 ml-sm-4">
          <v-img
            :src="subdivisionInfo.flagSrc"
            width="24px"
          />
        </div>
      </v-list-item>
    </template>
    <v-card
      max-height="calc(100vh - 128px)"
    >
      <div class="d-flex align-center pl-6">
        <v-icon
          v-if="job.jobState === 'dispatched'"
          large
          left
          color="blue-grey"
        >
          mdi-arrow-top-right
        </v-icon>
        <v-progress-circular
          v-else-if="job.jobState === 'accepted'"
          :size="32"
          indeterminate
          color="light-green"
          class="mr-3"
        />
        <v-icon
          v-else-if="job.jobState === 'rejected'"
          large
          left
          color="red lighten-1"
        >
          mdi-cancel
        </v-icon>
        <v-icon
          v-else-if="job.jobState === 'canceled'"
          large
          left
          color="blue-grey darken-2"
        >
          mdi-close
        </v-icon>
        <v-icon
          v-else-if="job.jobState === 'completed'"
          large
          left
          color="blue"
        >
          mdi-check
        </v-icon>
        <div>
          <v-card-title>
            Job details
          </v-card-title>
          <v-card-subtitle v-text="jobStateString" />
        </div>
      </div>
      <v-expand-transition>
        <div v-if="job.jobState === 'completed'">
          <v-divider />
          <div class="py-4 px-5">
            <div class="text-overline text--secondary">
              Result
            </div>
            <template v-if="job.result.state === 'error'">
              <div class="body-2 red--text font-weight-medium">
                Error
              </div>
              <div class="text-overline mt-3 text--secondary">
                Error code
              </div>
              <div
                class="body-2"
                v-text="job.result.errorCode"
              />
            </template>
            <div
              v-else-if="job.result.state === 'success'"
              class="body-2 text--primary"
            >
              Success
            </div>
            <div
              v-else-if="job.result.state === 'timeout'"
              class="body-2 amber--text"
            >
              Timeout
            </div>
            <template v-if="executionTimeString !== undefined">
              <div class="text-overline mt-3 text--secondary">
                Execution time
              </div>
              <div class="body-2 text--primary">
                {{ executionTimeString }} seconds
              </div>
            </template>
            <template v-if="httpStatusDetails !== undefined">
              <div class="text-overline mt-3 text--secondary">
                HTTP status code
              </div>
              <div :class="`body-2 ${httpStatusDetails.textColor}`">
                {{ httpStatusDetails.code }} - {{ httpStatusDetails.httpText }}
              </div>
            </template>
          </div>
        </div>
      </v-expand-transition>
      <v-divider />
      <div class="py-4 px-5 overflow-y-auto">
        <div class="text-overline text--secondary">
          Dispatch time
        </div>
        <div
          class="body-2 text--primary"
          v-text="dispatchTimeString"
        />
        <v-expand-transition>
          <div v-if="acceptTimeString !== undefined">
            <div class="text-overline mt-3 text--secondary">
              Accept time
            </div>
            <div
              class="body-2 text--primary"
              v-text="acceptTimeString"
            />
          </div>
        </v-expand-transition>
        <v-expand-transition>
          <div v-if="rejectTimeString !== undefined">
            <div class="text-overline mt-3 text--secondary">
              Reject time
            </div>
            <div
              class="body-2 text--primary"
              v-text="rejectTimeString"
            />
          </div>
        </v-expand-transition>
        <v-expand-transition>
          <div v-if="completeTimeString !== undefined">
            <div class="text-overline mt-3 text--secondary">
              Complete time
            </div>
            <div
              class="body-2 text--primary"
              v-text="completeTimeString"
            />
          </div>
        </v-expand-transition>
        <div class="text-overline mt-3 text--secondary">
          Location
        </div>
        <div class="body-2 text--primary d-flex align-center">
          <div class="mr-4">
            <v-img
              :src="subdivisionInfo.flagSrc"
              width="24px"
            />
          </div>
          <div v-text="subdivisionInfo.displayCountryAndRegionName" />
        </div>
        <div class="text-overline mt-3 text--secondary">
          Internet Service Provider
        </div>
        <div
          class="body-2 text--primary"
          v-text="job.ispName"
        />
        <div class="text-overline mt-3 text--secondary">
          Job ID
        </div>
        <div
          class="body-2 text--primary"
          v-text="job.id"
        />
      </div>
    </v-card>
  </v-bottom-sheet>
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

    private static dateToString (date: Date) {
      return date.toLocaleString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    }

    get subdivision (): iso3166.SubdivisionInfo.Full | null {
      return iso3166.subdivision(this.job.countryCode, this.job.regionCode);
    }

    get subdivisionInfo () {
      const displayCountryName = this.subdivision?.countryName ?? this.job.countryCode;
      const displayRegionName = this.subdivision?.name ?? this.job.regionCode;

      return {
        flagSrc: `https://www.countryflags.io/${this.job.countryCode}/flat/64.png`,
        displayCountryName,
        displayRegionName,
        displayCountryAndRegionName: `${displayRegionName}, ${displayCountryName}`,
      };
    }

    get jobStateString (): string {
      if (this.job.jobState === 'dispatched') return 'Dispatched to provider';
      if (this.job.jobState === 'accepted') return 'Accepted by provider';
      if (this.job.jobState === 'rejected') return 'Rejected by provider';
      if (this.job.jobState === 'canceled') return 'Canceled';
      return 'Completed';
    }

    get dispatchTimeString (): string {
      return QueryDetailsJobItem.dateToString(this.job.dispatchTimestamp);
    }

    get acceptTimeString (): string | undefined {
      if (!('acceptTimestamp' in this.job)) return;
      return QueryDetailsJobItem.dateToString(this.job.acceptTimestamp);
    }

    get rejectTimeString (): string | undefined {
      if (!('rejectTimestamp' in this.job)) return;
      return QueryDetailsJobItem.dateToString(this.job.rejectTimestamp);
    }

    get completeTimeString (): string | undefined {
      if (!('completeTimestamp' in this.job)) return;
      return QueryDetailsJobItem.dateToString(this.job.completeTimestamp);
    }

    get httpStatusDetails (): { code: number; color: string; textColor: string; httpText: string | undefined } | undefined {
      if (this.job.jobState !== 'completed' || this.job.result.state !== 'success') return;

      const code = this.job.result.httpCode;

      let color: string;

      if (code < 100 || code >= 600) color = 'blue-grey darken-3';
      else if (code <= 199) color = 'white black--text';
      else if (code <= 299) color = 'green';
      else if (code <= 399) color = 'yellow black--text';
      else if (code <= 499) color = 'red';
      else color = 'red darken-3';

      let textColor: string;

      if (code < 100 || code >= 600) textColor = 'blue-grey--text text--darken-3';
      else if (code <= 199) textColor = 'white--text';
      else if (code <= 299) textColor = 'green--text';
      else if (code <= 399) textColor = 'yellow--text';
      else if (code <= 499) textColor = 'red--text';
      else textColor = 'red--text text--darken-3';

      let httpText: string | undefined;

      try {
        httpText = HttpStatus.getStatusText(code);
      } catch (error) {
        httpText = undefined;
      }

      return {
        code,
        color,
        textColor,
        httpText,
      };
    }

    get executionTimeString (): string | undefined {
      if (this.job.jobState !== 'completed' || this.job.result.state === 'error') return undefined;

      return (this.job.result.executionTime / 1000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }
</script>
