<template>
  <v-main>
    <v-container
      v-if="urlError !== null"
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
          v-if="url.port !== undefined"
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
                  v-if="query.port !== undefined"
                  label="Port"
                  :different="url.port !== query.port"
                >
                  :{{ query.port }}
                </interactive-url-element>
                <interactive-url-element
                  v-else-if="url.port !== undefined"
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
            <div class="mx-8 mt-8 mb-4">
              <v-progress-linear
                indeterminate
                color="primary"
              />
            </div>
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
                  color="primary"
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
    <v-overlay
      absolute
      :value="false"
    >
      <v-progress-circular
        indeterminate
        :size="96"
        color="primary"
      />
    </v-overlay>
  </v-main>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import InteractiveUrlElement from '@/components/InteractiveUrlElement.vue';
  import PieChart from '@/components/PieChart.vue';
  import { colors } from 'vuetify/lib';
  import {
    CompletedHistoryJob,
    HistoryQuery,
    JobResultError,
    JobResultSuccess, QueryURL,
  } from '@/types';
  import _ from 'lodash';
  import ExecutionTimeChart from '@/components/ExecutionTimeChart.vue';
  import JobStateCard from '@/components/JobStateCard.vue';
  import JobResultsCard from '@/components/JobResultsCard.vue';
  import ExecutionTimeCard from '@/components/ExecutionTimeCard.vue';

  @Component({
    components: { JobResultsCard, JobStateCard, ExecutionTimeChart, ExecutionTimeCard, PieChart, InteractiveUrlElement },
  })
  export default class History extends Vue {
    url: QueryURL | null = null;

    urlError: string | null = null;

    queries: HistoryQuery[] = [
      {
        id: '123456',
        protocol: 'http:',
        hostname: 'www.google.com',
        port: undefined,
        pathname: '/path',
        search: '',
        timestamp: new Date(),
        jobs: [
          {
            jobState: 'dispatched',
            id: 'abcdef',
            queryId: '123456',
          },
          {
            jobState: 'accepted',
            id: 'abcdef',
            queryId: '123456',
          },
          {
            jobState: 'completed',
            id: 'asdfghjkl',
            queryId: '123456',
            result: {
              state: 'success',
              executionTime: 2000,
              httpCode: 200,
            },
          },
          {
            jobState: 'dispatched',
            id: 'qwerty',
            queryId: '123456',
          },
          {
            jobState: 'completed',
            id: 'zxcvb',
            queryId: '123456',
            result: {
              state: 'timeout',
              executionTime: 30015,
            },
          },
          {
            jobState: 'completed',
            id: 'mnbv',
            queryId: '123456',
            result: {
              state: 'error',
              errorCode: 'ERROR_CODE',
            },
          },
          {
            jobState: 'completed',
            id: 'mnbv',
            queryId: '123456',
            result: {
              state: 'success',
              executionTime: 5219,
              httpCode: 404,
            },
          },
          {
            jobState: 'completed',
            id: 'jjsajfj',
            queryId: '123456',
            result: {
              state: 'success',
              executionTime: 17093,
              httpCode: 502,
            },
          },
        ],
      },
      {
        id: '098765',
        protocol: 'https:',
        hostname: 'www.google.com',
        port: 5000,
        pathname: '/',
        search: '?hello=15',
        timestamp: new Date(),
        jobs: [],
      },
      {
        id: '465653255',
        protocol: 'https:',
        hostname: 'google.com',
        port: 300,
        pathname: '/',
        search: '',
        timestamp: new Date(),
        jobs: [
          {
            jobState: 'dispatched',
            id: 'ojkhsfajohsgfa',
            queryId: '465653255',
          },
        ],
      },
    ];

    get queryItems () {
      return this.queries.map((query) => {
        const jobStateCounts = _.countBy(query.jobs, 'jobState');
        const jobResults = _.groupBy(
          query.jobs.filter((job) => job.jobState === 'completed') as CompletedHistoryJob[],
          'result.state',
        );
        return ({
          id: query.id,
          dateString: query.timestamp.toLocaleString(undefined, {
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
              jobResults.error as CompletedHistoryJob<JobResultError>[],
              (job) => job.result.errorCode,
            ),
          ).map(([code, count]) => ({ code, count })),
          httpCodeCounts: jobResults.success === undefined ? [] : _.toPairs(
            _.countBy(
              jobResults.success as CompletedHistoryJob<JobResultSuccess>[],
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
          port: url.port === '' ? undefined : parseInt(url.port, 10),
          pathname: url.pathname,
          search: url.search,
        };
      } catch (error) {
        this.url = null;
        this.urlError = 'Failed to parse URL';
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
