<template>
  <Doughnut :data="computedData" :options="options" />
</template>

<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";
import { defineComponent } from "vue";
import { ChartData, ChartOptions } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default defineComponent({
  name: "AdminChart",
  components: {
    Doughnut,
  },
  props: {
    chartData: {
      type: Array as () => number[],
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
        },
      } as ChartOptions<"doughnut">,
    };
  },
  computed: {
    computedData(): ChartData<"doughnut"> {
      return {
        labels: ["Users", "Reservations", "Hotels", "Experiences"],
        datasets: [
          {
            label: "Overview",
            data: this.chartData.length ? this.chartData : [0, 0, 0, 0],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          },
        ],
      };
    },
  },
});
</script>
