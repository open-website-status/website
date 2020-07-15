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
        <HistoryURLElement label="Protocol">
          {{ url.protocol }}//
        </HistoryURLElement>
        <HistoryURLElement label="Hostname">
          {{ url.hostname }}
        </HistoryURLElement>
        <HistoryURLElement
          v-if="url.port !== undefined"
          label="Port"
        >
          :{{ url.port }}
        </HistoryURLElement>
        <HistoryURLElement label="Pathname">
          {{ url.pathname }}
        </HistoryURLElement>
        <HistoryURLElement
          v-if="url.search !== ''"
          label="Search"
        >
          {{ url.search }}
        </HistoryURLElement>
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
                <HistoryURLElement
                  label="Protocol"
                  :different="url.protocol !== query.protocol"
                >
                  {{ query.protocol }}//
                </HistoryURLElement>
                <HistoryURLElement label="Hostname">
                  {{ query.hostname }}
                </HistoryURLElement>
                <HistoryURLElement
                  v-if="query.port !== undefined"
                  label="Port"
                  :different="url.port !== query.port"
                >
                  :{{ query.port }}
                </HistoryURLElement>
                <HistoryURLElement
                  v-else-if="url.port !== undefined"
                  label="Default port"
                  different
                >
                  &empty;
                </HistoryURLElement>
                <HistoryURLElement
                  label="Pathname"
                  :different="url.pathname !== query.pathname"
                >
                  {{ query.pathname }}
                </HistoryURLElement>
                <HistoryURLElement
                  v-if="query.search !== ''"
                  label="Search"
                  :different="url.search !== query.search"
                >
                  {{ query.search }}
                </HistoryURLElement>
                <HistoryURLElement
                  v-else-if="url.search !== ''"
                  label="No search"
                  different
                >
                  &empty;
                </HistoryURLElement>
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
                  <v-card outlined>
                    <v-card-title>
                      Job status
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
                            v-for="(item, i) in query.jobStatues"
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
                    <div
                      v-if="query.jobCount === 0"
                      class="text-center text-subtitle-1 my-6 mx-4 text--secondary"
                    >
                      No jobs
                    </div>
                    <div
                      v-else
                      class="pa-4 pa-md-2 mx-auto history-status-chart-wrapper"
                    >
                      <pie-chart
                        :data="query.jobStatues"
                      />
                    </div>
                  </v-card>
                </v-col>
                <v-col
                  :cols="12"
                  :sm="6"
                  :md="4"
                >
                  <v-card outlined>
                    <v-card-title>
                      Results
                    </v-card-title>
                    <v-divider />
                    <div
                      v-if="query.completedJobCount === 0"
                      class="text-center text-subtitle-1 my-6 mx-4 text--secondary"
                    >
                      No completed jobs
                    </div>
                    <template v-if="query.timeoutCount > 0 || query.errorCounts.length > 0">
                      <v-subheader>Errors</v-subheader>
                      <v-list
                        subheader
                        dense
                      >
                        <v-list-item>
                          <v-sheet
                            color="amber darken-1"
                            height="24"
                            rounded
                            class="mr-3 px-2"
                          >
                            {{ query.timeoutCount }}
                          </v-sheet>
                          <v-list-item-content>
                            <v-list-item-title>
                              Timeout
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          v-for="error in query.errorCounts"
                          :key="error.code"
                        >
                          <v-sheet
                            color="red"
                            height="24"
                            rounded
                            class="mr-3 px-2"
                          >
                            {{ error.count }}
                          </v-sheet>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ error.code }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </template>
                    <v-divider
                      v-if="(query.timeoutCount > 0 || query.errorCounts.length > 0)
                        && query.httpCodeCounts.length > 0"
                    />
                    <template v-if="query.httpCodeCounts.length > 0">
                      <v-subheader>Responses</v-subheader>
                      <v-list
                        subheader
                        dense
                      >
                        <v-list-item
                          v-for="code in query.httpCodeCounts"
                          :key="code.code"
                        >
                          <v-sheet
                            :color="code.color"
                            height="24"
                            rounded
                            class="mr-3 px-2"
                          >
                            {{ code.count }}
                          </v-sheet>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ code.code }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              {{ code.text }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </template>
                  </v-card>
                </v-col>
                <v-col
                  :cols="12"
                  :sm="12"
                  :md="4"
                >
                  <v-card outlined>
                    <v-card-title>
                      Execution time
                    </v-card-title>
                    <v-divider />
                    <template v-if="query.timeoutCount > 0">
                      <v-card-text>
                        <v-alert
                          color="amber"
                          text
                          border="left"
                          class="mb-0"
                        >
                          {{ query.timeoutCount }}
                          {{ query.timeoutCount === 1 ? 'timeout' : 'timeouts' }}
                        </v-alert>
                      </v-card-text>
                      <v-divider />
                    </template>
                    <v-card-text
                      v-if="query.averageTime !== null"
                      class="text--primary"
                    >
                      <div class="text-center subtitle-1">
                        Average time:
                      </div>
                      <h4 class="text-center text-h3 font-weight-thin">
                        {{ query.averageTime }} s
                      </h4>
                      <ExecutionTimeChart
                        :data="query.executionTimes"
                        class="mt-2"
                      />
                    </v-card-text>
                    <div
                      v-if="query.averageTime === null"
                      class="text-center text-subtitle-1 my-6 mx-4 text--secondary"
                    >
                      No responses
                    </div>
                  </v-card>
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
                  View details <v-icon right>
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
  import HistoryURLElement from '@/components/HistoryURLElement.vue';
  import PieChart from '@/components/PieChart.vue';
  import { colors } from 'vuetify/lib';
  import {
    BaseHistoryJob,
    CompletedJob,
    HistoryQuery,
    JobResultError,
    JobResultSuccess, QueryURL,
  } from '@/types';
  import _ from 'lodash';
  import HttpStatus from 'http-status-codes';
  import ExecutionTimeChart from '@/components/ExecutionTimeChart.vue';

  @Component({
    components: { ExecutionTimeChart, PieChart, HistoryURLElement },
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
    ];

    get queryItems () {
      return this.queries.map((query) => {
        const jobStateCounts = _.countBy(query.jobs, 'jobState');
        const jobResults = _.groupBy(
          query.jobs.filter((job) => job.jobState === 'completed') as Array<CompletedJob & BaseHistoryJob>,
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
          jobCount: query.jobs.length,
          jobStatues: [
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
              description: 'Result has been received',
            },
          ],
          completedJobCount: jobStateCounts.completed ?? 0,
          timeoutCount: jobResults.timeout?.length ?? 0,
          errorCounts: jobResults.error === undefined ? [] : _.orderBy(
            _.toPairs(_.countBy(
              jobResults.error as Array<CompletedJob<JobResultError> & BaseHistoryJob>,
              (job) => job.result.errorCode,
            )),
            [([code]) => code],
            ['asc'],
          ).map(([code, count]) => ({ code, count })),
          httpCodeCounts: jobResults.success === undefined ? [] : _.orderBy(
            _.toPairs(_.countBy(
              jobResults.success as Array<CompletedJob<JobResultSuccess> & BaseHistoryJob>,
              (job) => job.result.httpCode,
            )),
            [([codeString]) => parseInt(codeString, 10)],
            ['asc'],
          ).map(([codeString, count]) => {
            let color: string;
            const code = parseInt(codeString, 10);

            if (code < 100 || code >= 600) color = 'blue-grey darken-3';
            else if (code <= 199) color = 'white black--text';
            else if (code <= 299) color = 'green';
            else if (code <= 399) color = 'yellow black--text';
            else if (code <= 499) color = 'red';
            else color = 'red darken-3';

            let statusText: string | undefined;

            try {
              statusText = HttpStatus.getStatusText(code);
            } catch (error) {
              statusText = undefined;
            }

            return ({
              code,
              count,
              color,
              text: statusText,
            });
          }),
          averageTime: jobResults.success === undefined || jobResults.success.length === 0 ? null
            : (_.meanBy(
              jobResults.success as Array<CompletedJob<JobResultSuccess> & BaseHistoryJob>,
              'result.executionTime',
            ) / 1000).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
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
  .history-url {
    margin: -1px;
    display: flex;
    overflow: auto;
  }

  .history-status-chart-wrapper {
    max-width: 250px
  }

  .info-button {
    margin-top: -8px;
    margin-bottom: -8px;
  }
</style>
