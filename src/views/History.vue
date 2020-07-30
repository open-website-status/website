<template>
  <v-main>
    <not-connected-container v-if="!$typedStore.state.connected" />
    <v-container
      v-else-if="urlError !== null"
      class="history-container history-container--error
        fill-height d-flex flex-column
        align-center justify-center text-center"
    >
      <v-icon
        size="96"
        color="error"
      >
        mdi-alert-circle
      </v-icon>
      <h4 class="text-h4 mt-8">
        The provided URL is invalid
      </h4>
      <h5
        class="text-h5 mt-4"
        v-text="urlError"
      />
    </v-container>
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
      v-else-if="queryItems === null"
      class="fill-height align-center justify-center"
    >
      <v-progress-circular
        indeterminate
        :size="96"
        color="primary"
      />
    </v-container>
    <v-container
      v-else-if="url !== null"
      class="history-container"
    >
      <div class="history-url justify-center py-6 py-md-12">
        <interactive-url-element label="Protocol">
          {{ url.protocol }}//
        </interactive-url-element>
        <interactive-url-element label="Hostname">
          {{ url.hostname }}
        </interactive-url-element>
        <interactive-url-element
          v-if="url.port !== null"
          label="Port"
        >
          :{{ url.port }}
        </interactive-url-element>
        <interactive-url-element label="Pathname">
          {{ url.pathname }}
        </interactive-url-element>
        <interactive-url-element
          v-if="url.search !== ''"
          label="Search"
        >
          {{ url.search }}
        </interactive-url-element>
      </div>
      <v-expansion-panels
        hover
        :popout="$vuetify.breakpoint.mdAndUp"
      >
        <v-expansion-panel
          v-for="query in queryItems"
          :key="query.id"
        >
          <v-expansion-panel-header>
            <div class="mr-2 overflow-x-hidden">
              <div class="d-flex">
                <div v-text="query.dateString" />
              </div>
              <div class="history-url mt-2">
                <interactive-url-element
                  label="Protocol"
                  :different="url.protocol !== query.protocol"
                >
                  {{ query.protocol }}//
                </interactive-url-element>
                <interactive-url-element
                  label="Hostname"
                  :different="url.hostname !== query.hostname"
                >
                  {{ query.hostname }}
                </interactive-url-element>
                <interactive-url-element
                  v-if="query.port !== null"
                  label="Port"
                  :different="url.port !== query.port"
                >
                  :{{ query.port }}
                </interactive-url-element>
                <interactive-url-element
                  v-else-if="url.port !== null"
                  label="Default port"
                  different
                >
                  &empty;
                </interactive-url-element>
                <interactive-url-element
                  label="Pathname"
                  :different="url.pathname !== query.pathname"
                >
                  {{ query.pathname }}
                </interactive-url-element>
                <interactive-url-element
                  v-if="query.search !== ''"
                  label="Search"
                  :different="url.search !== query.search"
                >
                  {{ query.search }}
                </interactive-url-element>
                <interactive-url-element
                  v-else-if="url.search !== ''"
                  label="No search"
                  different
                >
                  &empty;
                </interactive-url-element>
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>
              <v-row>
                <v-col
                  :cols="12"
                  :sm="6"
                  :md="4"
                >
                  <job-state-card
                    :job-states="query.jobStates"
                    class="fill-height"
                  />
                </v-col>
                <v-col
                  :cols="12"
                  :sm="6"
                  :md="4"
                >
                  <job-results-card
                    :timeout-count="query.timeoutCount"
                    :error-counts="query.errorCounts"
                    :http-code-counts="query.httpCodeCounts"
                    class="fill-height"
                  />
                </v-col>
                <v-col
                  :cols="12"
                  :sm="12"
                  :md="4"
                >
                  <execution-time-card
                    :timeout-count="query.timeoutCount"
                    :execution-times="query.executionTimes"
                    class="fill-height"
                  />
                </v-col>
              </v-row>
              <div class="d-flex">
                <v-spacer />
                <v-btn
                  rounded
                  outlined
                  color="secondary"
                  :to="`/query-details/${query.id}`"
                >
                  View details
                  <v-icon right>
                    mdi-arrow-right
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </v-main>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import InteractiveUrlElement from '@/components/InteractiveUrlElement.vue';
  import PieChart from '@/components/PieChart.vue';
  import { colors } from 'vuetify/lib';
  import {
    CompletedJobError,
    CompletedJobSuccess,
    QueryURL,
    QueryWithJobs,
  } from '@/types';
  import _ from 'lodash';
  import ExecutionTimeChart from '@/components/ExecutionTimeChart.vue';
  import JobStateCard from '@/components/JobStateCard.vue';
  import JobResultsCard from '@/components/JobResultsCard.vue';
  import ExecutionTimeCard from '@/components/ExecutionTimeCard.vue';
  import NotConnectedContainer from '@/components/NotConnectedContainer.vue';
  import { CompletedJob, Job, JobResultSuccess, Query } from '@open-website-status/api';

  @Component({
    components: {
      JobResultsCard,
      JobStateCard,
      ExecutionTimeChart,
      ExecutionTimeCard,
      PieChart,
      InteractiveUrlElement,
      NotConnectedContainer,
    },
  })
  export default class History extends Vue {
    url: QueryURL | null = null;

    urlError: string | null = null;

    error: {
      title: string;
      message: string | null;
    } | null = null;

    get queriesWithJobs (): QueryWithJobs[] | null {
      if (this.hostname === null) return null;
      const queries: Query[] | undefined = this.$typedStore.state.hostnameQueries[this.hostname];
      if (queries === undefined) return null;
      const queriesWithJobsOrNull = queries.map((query): QueryWithJobs | null => {
        const jobs: Job[] | undefined = this.$typedStore.state.jobs[query.id];
        if (jobs === undefined) return null;
        return {
          ...query,
          jobs,
        };
      });
      return queriesWithJobsOrNull.filter((e) => e !== null) as QueryWithJobs[];
    }

    get queryItems () {
      if (this.queriesWithJobs === null) return null;
      const sortedQueriesWithJobs = _.orderBy(
        this.queriesWithJobs,
        [(e) => new Date(e.timestamp).getTime()],
        ['desc'],
      );
      return sortedQueriesWithJobs.map((query: QueryWithJobs) => {
        const jobStateCounts = _.countBy(query.jobs, 'jobState');
        const jobResults = _.groupBy(
          query.jobs.filter((job) => job.jobState === 'completed') as CompletedJob[],
          'result.state',
        );
        return ({
          id: query.id,
          dateString: new Date(query.timestamp).toLocaleString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }),
          protocol: query.protocol,
          hostname: query.hostname,
          port: query.port,
          pathname: query.pathname,
          search: query.search,
          jobStates: [
            {
              label: 'Dispatched',
              color: colors.blueGrey.base,
              data: jobStateCounts.dispatched ?? 0,
              description: 'Sent to providers',
            },
            {
              label: 'Accepted',
              color: colors.lightGreen.base,
              data: jobStateCounts.accepted ?? 0,
              description: 'Jobs in progress',
            },
            {
              label: 'Rejected',
              color: colors.red.lighten1,
              data: jobStateCounts.rejected ?? 0,
              description: 'Jobs that won\'t be done by providers',
            },
            {
              label: 'Canceled',
              color: colors.blueGrey.darken2,
              data: jobStateCounts.canceled ?? 0,
              description: 'Jobs canceled for any reason',
            },
            {
              label: 'Completed',
              color: colors.blue.base,
              data: jobStateCounts.completed ?? 0,
              description: 'Result have been received',
            },
          ],
          completedJobCount: jobStateCounts.completed ?? 0,
          timeoutCount: jobResults.timeout?.length ?? 0,
          errorCounts: jobResults.error === undefined ? [] : _.toPairs(
            _.countBy(
              jobResults.error as CompletedJobError[],
              (job) => job.result.errorCode,
            ),
          ).map(([code, count]) => ({ code, count })),
          httpCodeCounts: jobResults.success === undefined ? [] : _.toPairs(
            _.countBy(
              jobResults.success as CompletedJobSuccess[],
              (job) => job.result.httpCode,
            )).map(([code, count]) => ({
            code: parseInt(code, 10),
            count,
          })),
          executionTimes: jobResults.success
            ?.map((v) => (v.result as JobResultSuccess).executionTime) ?? [],
        });
      });
    }

    @Watch('$route.params.href', {
      immediate: true,
    })
    parseHref (href: string) {
      try {
        const url = new URL(href.trim());
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          this.url = null;
          this.urlError = 'The only supported protocols are http: and https:';
          return;
        }

        if (url.username !== '' || url.password !== '') {
          this.url = null;
          this.urlError = 'The URL cannot contain a username or password';
          return;
        }

        this.urlError = null;
        this.url = {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port === '' ? null : parseInt(url.port, 10),
          pathname: url.pathname,
          search: url.search,
        };
      } catch (error) {
        this.url = null;
        this.urlError = 'Failed to parse URL';
      }
    }

    get hostname () {
      if (!this.$typedStore.state.connected) return null;
      return this.url?.hostname ?? null;
    }

    @Watch('hostname', {
      immediate: true,
    })
    async onHostnameChanged (value: string | null) {
      if (value === null) return;
      try {
        await this.$api.getHostnameQueries(value, true);
      } catch (error) {
        this.error = {
          title: 'Failed to get history',
          message: error instanceof Error ? error.message : null,
        };
      }
    }
  }
</script>

<style lang="scss">
  .history-container {
    max-width: 1200px;

    .history-url {
      margin: -1px;
      display: flex;
      overflow: auto;
    }
  }
</style>
