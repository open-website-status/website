<template>
  <v-card
    outlined
    class="d-flex flex-column"
  >
    <v-card-title>
      Results
    </v-card-title>
    <v-divider />
    <template v-if="timeoutCount === 0 && errorCodeItems.length === 0 && httpCodeItems.length === 0">
      <v-spacer />
      <div
        class="text-center text-subtitle-1 my-6 mx-4 text--secondary"
      >
        No completed jobs
      </div>
      <v-spacer />
    </template>
    <template v-if="timeoutCount > 0 || errorCodeItems.length > 0">
      <v-subheader>Errors</v-subheader>
      <v-list
        subheader
        dense
      >
        <v-list-item v-if="timeoutCount > 0">
          <v-sheet
            color="amber darken-1"
            height="24"
            rounded
            class="mr-3 px-2"
          >
            {{ timeoutCount }}
          </v-sheet>
          <v-list-item-content>
            <v-list-item-title>
              Timeout
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="error in errorCodeItems"
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
      v-if="(timeoutCount > 0 || errorCodeItems.length > 0) && httpCodeItems.length > 0"
    />
    <template v-if="httpCodeItems.length > 0">
      <v-subheader>Responses</v-subheader>
      <v-list
        subheader
        dense
      >
        <v-list-item
          v-for="codeItem in httpCodeItems"
          :key="codeItem.code"
        >
          <v-sheet
            :color="codeItem.color"
            height="24"
            rounded
            class="mr-3 px-2"
          >
            {{ codeItem.count }}
          </v-sheet>
          <v-list-item-content>
            <v-list-item-title>
              {{ codeItem.code }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ codeItem.text }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-card>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import _ from 'lodash';
  import HttpStatus from 'http-status-codes';

  @Component
  export default class JobResultsCard extends Vue {
    @Prop({ required: true, type: Number })
    readonly timeoutCount!: number;

    @Prop({ required: true, type: Array })
    readonly httpCodeCounts!: {
      code: number;
      count: number;
    }[];

    @Prop({ required: true, type: Array })
    readonly errorCounts!: {
      code: string;
      count: number;
    }[];

    get httpCodeItems () {
      return _.orderBy(
        this.httpCodeCounts,
        ['code'],
        ['asc'],
      ).map((item) => {
        let color: string;

        if (item.code < 100 || item.code >= 600) color = 'blue-grey darken-3';
        else if (item.code <= 199) color = 'white black--text';
        else if (item.code <= 299) color = 'green';
        else if (item.code <= 399) color = 'yellow black--text';
        else if (item.code <= 499) color = 'red';
        else color = 'red darken-3';

        let statusText: string | undefined;

        try {
          statusText = HttpStatus.getStatusText(item.code);
        } catch (error) {
          statusText = undefined;
        }

        return ({
          code: item.code,
          count: item.count,
          color,
          text: statusText,
        });
      });
    }

    get errorCodeItems () {
      return _.orderBy(
        this.errorCounts,
        ['code'],
        ['asc'],
      );
    }
  }
</script>
