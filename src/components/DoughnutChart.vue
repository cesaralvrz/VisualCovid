<script>
import { Doughnut } from "vue-chartjs";
export default {
  extends: Doughnut,
  props: {
    label: {
      type: Array
    },
    chartData: {
      type: Array
    },
    options: {
      type: Object
    },
    chartColors: {
      type: Object
    }
},
  mounted() {
    const {
      borderColor,
      backgroundColor
    } = this.chartColors;
    this.renderChart(
      {
        labels: ["Casos", "Muertes"],
        datasets: [
          {
            label: this.labels,
            data: this.chartData,
            borderColor: borderColor,
            backgroundColor: backgroundColor
          }
        ]
      },
      this.options
    );
  }
};
</script>