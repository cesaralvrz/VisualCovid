<template>
<div>
    <div class="row">
      <div class="col text-center mt-5">
        <h1>Visualización COVID-19 en España</h1>
        <template v-if="arrCasosPcr[0]">
            <p>{{arrCasosPcr[0].total}}</p>
            <p>{{arrCasosPcr[0].fecha}}</p>
        </template>
      </div>
    </div>

    <div class="row mt-5" v-if="arrCasosPcr.length > 0">
      <div class="col">
        <h2>Casos Confirmados</h2>
        <line-chart 
        :chartData="arrCasosPcr" 
        :options="chartOptions" 
        :chartColors="casosColors" 
        label="casos">
        </line-chart>
      </div>
    </div>

    <div class="row mt-5" v-if="arrFallecimientos.length > 0">
      <div class="col">
        <h2>Número de Fallecidos</h2>
        <line-chart 
        :chartData="arrFallecimientos" 
        :options="chartOptions" 
        :chartColors="fallecidosColors" 
        label="fallecimientos">
        </line-chart>
      </div>
    </div>
</div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';

import LineChart from './LineChart';

export default {
    components: {
        LineChart
    },
    data() {
        return {
            arrCasosPcr: [],
            casosColors: {
                borderColor: "#077187",
                pointBorderColor: "#0E1428",
                pointBackgroundColor: "#AFD6AC",
                backgroundColor: "#74A57F"
            },
            arrFallecimientos: [],
            fallecidosColors: {
                borderColor: "#251F47",
                pointBorderColor: "#260F26",
                pointBackgroundColor: "#858EAB",
                backgroundColor: "#858EAB"
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
            }
        }
    },
    async created(){
        const datos = await axios.get('https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/nacional_covid19.csv');
        // aconvert.com/es/document/csv-to-json/
        const input = datos.data

        // Csv a JSON
        const lines = input.split('\n') 
        const header = lines[0].split(',') 
        const output = lines.slice(1).map(line => {
            const fields = line.split(',') 
            return Object.fromEntries(header.map((h, i) => [h, fields[i]]))
        })

        // última fecha elimanada (undefined)
        output.pop()

        Object.values(output).forEach(d => {

            var fecha = moment(d.fecha, "YYYY-MM-DD").format("MM/DD/YYYY");

            const {
                casos_pcr,
                fallecimientos,
            } = d;

            this.arrCasosPcr.unshift({total: casos_pcr, fecha});
            this.arrFallecimientos.unshift({fecha, total: fallecimientos});

        })

        //this.arrCasosPcr.shift()
        
    }
}
</script>