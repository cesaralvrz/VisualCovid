<script>
import { Bar } from 'vue-chartjs'
export default {
    props: ['vacunasAdmin', 'pautaComp'],
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
          "C.Valenciana",
          "Extremadura",
          "Galicia",
          "La Rioja",
          "C.Madrid",
          "Rd.Murcia",
          "Navarra",
          "País Vasco",
          "Ceuta",
          "Melilla",
        ],
        datasets: [
          {
            label: "Población",
            backgroundColor: "#f79d65",
            data: ["8427000", "1321000", "1022000", "1188000", "2207000", "581641", "2408000", "2035000", "7566000", "4975000", "1065000", "2700000", "313571", "6642000", "1488000", "649946", "2178000", "84829", "84689"]
          },
          {
            label: "Dosis Administradas",
            backgroundColor: "#339AF7",
            data: this.vacunasAdmin
          },
          {
            label: "Personas con Pauta Completa",
            backgroundColor: "#69c26a",
            data: this.pautaComp
          },
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