<script>
import { Bar } from 'vue-chartjs'
export default {
    extends: Bar,
    data: () => ({
    chartdata: {
      labels: ['Enero', 'Febrero'],
      datasets: [
        {
          label: 'Datos Uno',
          backgroundColor: '#42b883',
          data: [39, 39]
        },
        {
          label: 'Datos Dos',
          backgroundColor: '#35495e',
          data: [39, 39]
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }),
  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}
</script>