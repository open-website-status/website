<template>
  <div class="execution-time-chart">
    <canvas ref="canvas" width="250" height="150"></canvas>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import Chart from 'chart.js';
import _ from 'lodash';

@Component
export default class ExecutionTimeChart extends Vue {
  chart?: Chart

  $refs!: {
    canvas: HTMLCanvasElement;
  }

  @Prop({ required: true, type: Array })
  readonly data!: number[];

  get items() {
    return _.orderBy(this.data, [(v) => v], ['asc']).map((v) => _.round(v / 1000, 2));
  }

  @Watch('items')
  onDataChanged(value: number[]) {
    if (this.chart === undefined) return;
    this.chart.data.labels = this.calculateLabels(value);
    const dataset = this.chart.data.datasets?.[0];
    if (dataset !== undefined) {
      dataset.data = value;
      this.chart.update();
    }
  }

  calculateLabels(data: number[]) {
    if (data.length < 2) return new Array(data.length).fill('');
    return ['Fastest', ...new Array(data.length - 2).fill(''), 'Slowest'];
  }

  mounted() {
    this.chart = new Chart(this.$refs.canvas, {
      type: 'line',
      data: {
        datasets: [{
          data: this.items,
          borderColor: '#ffffff',
          pointBackgroundColor: '#ffffff',
          backgroundColor: '#ffffff11',
          borderWidth: 1,
          pointRadius: 3,
        }],
        labels: this.calculateLabels(this.items),
      },
      options: {
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              type: 'linear',
            },
          ],
        },
      },
    });
  }
}
</script>

<style lang="scss">
  .execution-time-chart {
    position: relative; // TODO: Verify if needed
    height: 150px;
  }
</style>
