<script>
import { Bar } from 'vue-chartjs'
export default {
    extends: Bar,
    data: () => ({
    chartdata: {
      labels: {
        type: Array
      },
      chartData: {
        type: Array
      },
      options: {
        type: Object
      },
    }
  }),
  mounted() {
    this.renderChart(
      {
        labels: [
          "Andalucia",
          "Aragón",
          "Asturias",
          "Baleares",
          "Canarias",
          "Cantabria",
          "Castilla y León",
          "C.La Mancha",
          "Cataluña",
          "Ceuta",
          "Extremadura",
          "Galicia",
          "La Rioja",
          "C.Madrid",
          "Melilla",
          "Murcia",
          "Navarra",
          "País Vasco",
          "Valencia",
        ],
        datasets: [
          {
            label: "Población",
            backgroundColor: "#f79d65",
            data: [8427000, 1321000, 1022000, 1188000, 2207000, 581641, 2408000, 2035000, 7566000, 84829, 1065000, 2700000, 313571, 6642000, 84689, 1488000, 649946, 2178000, 4975000]
          }
        ]
      },
      { 
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
          yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }]
          }, 
        }
    );
  }
}
</script>