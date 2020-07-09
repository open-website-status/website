<template>
  <div class="pie-chart">
    <canvas
      ref="canvas"
      width="250"
      height="250"
    />
  </div>
</template>

<script lang="ts">
  import {
    Component, Prop, Vue, Watch,
  } from 'vue-property-decorator';
  import { colors } from 'vuetify/lib';
  import Chart from 'chart.js';
  import { PieChartData } from '@/types';

@Component
  export default class PieChart extends Vue {
    chart?: Chart

    $refs!: {
      canvas: HTMLCanvasElement;
    }

    @Prop({ required: true, type: Array })
    readonly data!: PieChartData[];

    @Watch('data')
    onDataChanged (value: PieChartData[]) {
      if (this.chart === undefined) return;
      this.chart.data.labels = value.map((i) => i.label);
      const dataset = this.chart.data.datasets?.[0];
      if (dataset !== undefined) {
        dataset.data = value.map((i) => i.data);
        dataset.backgroundColor = value.map((i) => i.color);
        this.chart.update();
      }
    }

    mounted () {
      this.chart = new Chart(this.$refs.canvas, {
        type: 'pie',
        data: {
          datasets: [{
            data: this.data.map((i) => i.data),
            backgroundColor: this.data.map((i) => i.color),
            borderColor: colors.grey.darken4,
            borderWidth: 4,
          }],
          labels: this.data.map((i) => i.label),
        },
        options: {
          legend: {
            display: false,
          },
        },
      });
    }
  }
</script>

<style lang="scss">
  .pie-chart {
    position: relative; // TODO: Verify if needed
  }
</style>
