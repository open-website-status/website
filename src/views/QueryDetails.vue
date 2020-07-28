<template>
  <v-main>
    <not-connected-container v-if="!$typedStore.state.connected" />
    <v-container
      v-else-if="error !== null"
      class="query-details-container query-details-container--error
        fill-height d-flex flex-column
        align-center justify-center text-center"
    >
      <v-icon
        size="96"
        color="error"
      >
        mdi-alert-circle
      </v-icon>
      <h4
        class="text-h4 mt-8"
        v-text="error.title"
      />
      <h5
        v-if="error.message !== null"
        class="text-h5 mt-4"
        v-text="error.message"
      />
    </v-container>
    <v-container
      v-else
      class="query-details-container px-4 px-sm-8"
    >
      <h1 class="text-h4 my-6 mx-2">
        Summary
      </h1>
      <div class="text-overline mx-2">
        Check time
      </div>
      <h5
        class="text-h6 mx-2 mb-6"
        v-text="dateString"
      />
      <div class="text-overline mx-2">
        URL
      </div>
      <div class="url justify-start mx-2 my-1">
        <interactive-url-element label="Protocol">
          {{ query.protocol }}//
        </interactive-url-element>
        <interactive-url-element label="Hostname">
          {{ query.hostname }}
        </interactive-url-element>
        <interactive-url-element
          v-if="query.port !== undefined"
          label="Port"
        >
          :{{ query.port }}
        </interactive-url-element>
        <interactive-url-element label="Pathname">
          {{ query.pathname }}
        </interactive-url-element>
        <interactive-url-element
          v-if="query.search !== ''"
          label="Search"
        >
          {{ query.search }}
        </interactive-url-element>
      </div>
      <div class="d-flex justify-end mt-6 mb-4 mx-2">
        <v-btn
          rounded
          outlined
          :large="$vuetify.breakpoint.smAndUp"
          class="mr-3"
          :to="historyRoute"
        >
          View history
        </v-btn>
        <v-btn
          rounded
          color="primary"
          :large="$vuetify.breakpoint.smAndUp"
          :to="retryRoute"
        >
          Retry
        </v-btn>
      </div>
      <v-row>
        <v-col
          :cols="12"
          :sm="6"
          :md="4"
        >
          <job-state-card
            :job-states="jobStates"
            class="fill-height"
          />
        </v-col>
        <v-col
          :cols="12"
          :sm="6"
          :md="4"
        >
          <job-results-card
            :timeout-count="timeoutCount"
            :error-counts="errorCounts"
            :http-code-counts="httpCodeCounts"
            class="fill-height"
          />
        </v-col>
        <v-col
          :cols="12"
          :sm="12"
          :md="4"
        >
          <execution-time-card
            :timeout-count="timeoutCount"
            :execution-times="executionTimes"
            class="fill-height"
          />
        </v-col>
      </v-row>
      <h1 class="text-h4 my-6 mx-2">
        Job list
      </h1>
      <!-- TODO: Add transitions -->
      <v-list subheader>
        <v-subheader>Completed</v-subheader>
        <div
          v-if="completedJobs.length === 0"
          class="text-center mx-3 my-2 text--secondary text-body-2"
        >
          No completed jobs
        </div>
        <query-details-job-item
          v-for="job in completedJobs"
          :key="job.id"
          :job="job"
        />
        <v-subheader>In progress</v-subheader>
        <div
          v-if="jobsInProgress.length === 0"
          class="text-center mx-3 my-2 text--secondary text-body-2"
        >
          No jobs in progress
        </div>
        <query-details-job-item
          v-for="job in jobsInProgress"
          :key="job.id"
          :job="job"
        />
        <v-subheader>Canceled or rejected</v-subheader>
        <div
          v-if="canceledOrRejectedJobs.length === 0"
          class="text-center mx-3 mt-2 mb-4 text--secondary text-body-2"
        >
          No canceled or rejected jobs
        </div>
        <query-details-job-item
          v-for="job in canceledOrRejectedJobs"
          :key="job.id"
          :job="job"
        />
      </v-list>
    </v-container>
  </v-main>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import {
    CompletedFullJob,
    FullJob,
    JobResultError,
    JobResultSuccess,
    JobStateItem,
    Query,
  } from '@/types';
  import JobStateCard from '@/components/JobStateCard.vue';
  import JobResultsCard from '@/components/JobResultsCard.vue';
  import ExecutionTimeCard from '@/components/ExecutionTimeCard.vue';
  import { colors } from 'vuetify/lib';
  import _ from 'lodash';
  import InteractiveUrlElement from '@/components/InteractiveUrlElement.vue';
  import QueryDetailsJobItem from '@/components/QueryDetailsJobItem.vue';
  import NotConnectedContainer from '@/components/NotConnectedContainer.vue';

  @Component({
    components: {
      JobStateCard,
      JobResultsCard,
      ExecutionTimeCard,
      InteractiveUrlElement,
      QueryDetailsJobItem,
      NotConnectedContainer,
    },
  })
  export default class QueryDetails extends Vue {
    error: {
      title: string;
      message: string | null;
    } | null = null

    query: Query = {
      id: '123456',
      protocol: 'http:',
      hostname: 'www.google.com',
      port: undefined,
      pathname: '/path',
      search: '',
      timestamp: new Date(),
    }

    jobs: FullJob[] = [
      {
        id: 'abcdef',
        queryId: '123456',
        jobState: 'completed',
        countryCode: 'PL',
        ispName: 'Y-Mobile',
        regionCode: 'DS',
        dispatchTimestamp: new Date(),
        acceptTimestamp: new Date(),
        completeTimestamp: new Date(),
        result: {
          state: 'success',
          httpCode: 200,
          executionTime: 8192,
        },
      },
      {
        id: 'fafsafra',
        queryId: '123456',
        jobState: 'completed',
        countryCode: 'PL',
        ispName: 'Purple',
        regionCode: 'MA',
        dispatchTimestamp: new Date(),
        completeTimestamp: new Date(),
        acceptTimestamp: new Date(),
        result: {
          state: 'error',
          errorCode: 'Random error',
        },
      },
      {
        id: 'not-random',
        queryId: '123456',
        jobState: 'completed',
        countryCode: 'US',
        ispName: 'Minus',
        regionCode: 'NY',
        dispatchTimestamp: new Date(),
        acceptTimestamp: new Date(),
        completeTimestamp: new Date(),
        result: {
          state: 'timeout',
          executionTime: 32768,
        },
      },
      {
        id: 'who-even-cares',
        queryId: '123456',
        jobState: 'accepted',
        dispatchTimestamp: new Date(),
        acceptTimestamp: new Date(),
        countryCode: 'PL',
        ispName: 'Pause',
        regionCode: 'MA',
      },
    ]

    get href () {
      const { protocol, hostname, port, pathname, search } = this.query;
      return `${protocol}//${hostname}${port === undefined ? '' : `:${port}`}${pathname}${search}`;
    }

    get retryRoute () {
      return `/?q=${encodeURIComponent(this.href)}`;
    }

    get historyRoute () {
      return `/history/${encodeURIComponent(this.href)}`;
    }

    get dateString () {
      return this.query.timestamp.toLocaleString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    }

    get jobStateCounts () {
      return _.defaults(
        _.countBy(this.jobs, 'jobState'),
        {
          dispatched: 0,
          accepted: 0,
          rejected: 0,
          canceled: 0,
          completed: 0,
        },
      );
    }

    get jobResults () {
      const completedJobs = this.jobs.filter((job) => job.jobState === 'completed') as CompletedFullJob[];

      return _.groupBy(
        completedJobs,
        'result.state',
      );
    }

    get completedJobs () {
      return this.jobs.filter((job) => job.jobState === 'completed');
    }

    get jobsInProgress () {
      return this.jobs.filter((job) => job.jobState === 'dispatched' || job.jobState === 'accepted');
    }

    get canceledOrRejectedJobs () {
      return this.jobs.filter((job) => job.jobState === 'canceled' || job.jobState === 'rejected');
    }

    get timeoutCount () {
      return this.jobResults.timeout?.length ?? 0;
    }

    get jobStates (): JobStateItem[] {
      return [
        {
          label: 'Dispatched',
          color: colors.blueGrey.base,
          data: this.jobStateCounts.dispatched,
          description: 'Sent to providers',
        },
        {
          label: 'Accepted',
          color: colors.lightGreen.base,
          data: this.jobStateCounts.accepted,
          description: 'Jobs in progress',
        },
        {
          label: 'Rejected',
          color: colors.red.lighten1,
          data: this.jobStateCounts.rejected,
          description: 'Jobs that won\'t be done by providers',
        },
        {
          label: 'Canceled',
          color: colors.blueGrey.darken2,
          data: this.jobStateCounts.canceled,
          description: 'Jobs canceled for any reason',
        },
        {
          label: 'Completed',
          color: colors.blue.base,
          data: this.jobStateCounts.completed,
          description: 'Result have been received',
        },
      ];
    }

    get executionTimes () {
      return this.jobResults.success?.map(
        (v) => (v.result as JobResultSuccess).executionTime,
      ) ?? [];
    }

    get errorCounts () {
      if (this.jobResults.error === undefined) return [];
      return _.toPairs(
        _.countBy(
          this.jobResults.error as CompletedFullJob<JobResultError>[],
          (job) => job.result.errorCode,
        ),
      ).map(([code, count]) => ({ code, count }));
    }

    get httpCodeCounts () {
      if (this.jobResults.success === undefined) return [];
      return _.toPairs(
        _.countBy(
          this.jobResults.success as CompletedFullJob<JobResultSuccess>[],
          (job) => job.result.httpCode,
        )).map(([code, count]) => ({
        code: parseInt(code, 10),
        count,
      }));
    }
  }
</script>

<style lang="scss">
  .query-details-container {
    max-width: 1200px;

    .url {
      margin: -1px;
      display: flex;
      overflow: auto;
    }

    .fit-content {
      width: fit-content;
    }
  }
</style>
