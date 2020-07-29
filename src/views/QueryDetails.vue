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
      v-else-if="query === null"
      class="fill-height align-center justify-center"
    >
      <v-progress-circular
        indeterminate
        :size="96"
        color="primary"
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
          v-if="query.port"
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
      <div
        v-if="jobs === null"
        class="d-flex align-center justify-center my-8"
      >
        <v-progress-circular
          indeterminate
          :size="96"
          color="primary"
        />
      </div>
      <template v-else>
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
        <v-card outlined>
          <!-- TODO: Add transitions -->
          <v-list subheader>
            <div>
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
            </div>
            <div>
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
            </div>
            <div>
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
            </div>
          </v-list>
        </v-card>
      </template>
    </v-container>
  </v-main>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import {
    CompletedJobError,
    CompletedJobSuccess,
    JobStateItem,
  } from '@/types';
  import JobStateCard from '@/components/JobStateCard.vue';
  import JobResultsCard from '@/components/JobResultsCard.vue';
  import ExecutionTimeCard from '@/components/ExecutionTimeCard.vue';
  import { colors } from 'vuetify/lib';
  import _ from 'lodash';
  import InteractiveUrlElement from '@/components/InteractiveUrlElement.vue';
  import QueryDetailsJobItem from '@/components/QueryDetailsJobItem.vue';
  import NotConnectedContainer from '@/components/NotConnectedContainer.vue';
  import { CompletedJob, Job, JobResultSuccess, Query } from '@open-website-status/api';
  import { Dictionary } from 'vue-router/types/router';

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

    query: Query | null = null;

    get jobs (): Job[] | null {
      if (this.queryId === null) return null;
      return this.$typedStore.state.jobs[this.queryId] ?? null;
    }

    get href () {
      if (this.query === null) return null;
      const { protocol, hostname, port, pathname, search } = this.query;
      return `${protocol}//${hostname}${_.isNil(port) ? '' : `:${port}`}${pathname}${search}`;
    }

    get retryRoute () {
      if (this.href === null) return null;
      return `/?q=${encodeURIComponent(this.href)}`;
    }

    get historyRoute () {
      if (this.href === null) return null;
      return `/history/${encodeURIComponent(this.href)}`;
    }

    get dateString () {
      if (this.query === null) return null;
      return new Date(this.query.timestamp).toLocaleString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    }

    get jobStateCounts (): { canceled: number; dispatched: number; rejected: number; accepted: number; completed: number } | null {
      if (this.jobs === null) return null;
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

    get jobResults (): null | Dictionary<CompletedJob[]> {
      if (this.jobs === null) return null;
      const completedJobs = this.jobs.filter((job) => job.jobState === 'completed') as CompletedJob[];

      return _.groupBy(
        completedJobs,
        'result.state',
      );
    }

    get completedJobs () {
      if (this.jobs === null) return null;
      return this.jobs.filter((job) => job.jobState === 'completed');
    }

    get jobsInProgress () {
      if (this.jobs === null) return null;
      return this.jobs.filter((job) => job.jobState === 'dispatched' || job.jobState === 'accepted');
    }

    get canceledOrRejectedJobs () {
      if (this.jobs === null) return null;
      return this.jobs.filter((job) => job.jobState === 'canceled' || job.jobState === 'rejected');
    }

    get timeoutCount () {
      if (this.jobResults === null) return;
      return this.jobResults.timeout?.length ?? 0;
    }

    get jobStates (): JobStateItem[] | null {
      if (this.jobStateCounts === null) return null;
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
      if (this.jobResults === null) return;
      return this.jobResults.success?.map(
        (v) => (v.result as JobResultSuccess).executionTime,
      ) ?? [];
    }

    get errorCounts () {
      if (this.jobResults === null) return;
      if (this.jobResults.error === undefined) return [];
      return _.toPairs(
        _.countBy(
          this.jobResults.error as CompletedJobError[],
          (job) => job.result.errorCode,
        ),
      ).map(([code, count]) => ({ code, count }));
    }

    get httpCodeCounts () {
      if (this.jobResults === null) return;
      if (this.jobResults.success === undefined) return [];
      return _.toPairs(
        _.countBy(
          this.jobResults.success as CompletedJobSuccess[],
          (job) => job.result.httpCode,
        )).map(([code, count]) => ({
        code: parseInt(code, 10),
        count,
      }));
    }

    get queryId () {
      if (!this.$typedStore.state.connected) return null;
      return this.$route.params.queryId;
    }

    @Watch('queryId', {
      immediate: true,
    })
    async onQueryIdChanged (value: string | null) {
      this.query = null;
      if (value === null) return;
      try {
        this.query = await this.$api.getQuery(value, true);
      } catch (error) {
        this.error = {
          title: 'Failed to get query',
          message: error instanceof Error ? error.message : null,
        };
      }
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
