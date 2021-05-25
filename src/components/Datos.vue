<template>
<div>
    <div class="row">
      <div class="col text-center mt-5 mb-3">
        <h1>COVID-19 en España</h1>
      </div>
    </div>
    <div class="card text-center">
        <template v-if="arrCasosPcr[0]">
            <div class="row">
                <div class="col-sm-6">
                    <div class="card-body" id="mycontent-left">
                        <h3 class="card-title text-primary mt-3">Total de Casos:</h3>
                        <!-- Formateo a Número para luego agregar un separador de millares -->
                        <h4 class="card-title">{{Number(arrCasosPcr[0].total).toLocaleString()}}</h4>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="card-body">
                        <h3 class="card-title text-primary mt-3">Total de Fallecimientos:</h3>
                        <!-- Formateo a Número para luego agregar un separador de millares -->
                        <h4 class="card-title">{{Number(arrFallecimientos[0].total).toLocaleString()}}</h4>
                    </div>
                </div>
            </div>
            <div class="card-footer text-muted">
                Última fecha registrada: {{arrCasosPcr[0].date}}
            </div>
        </template>
    </div>

    <div class="dropdown mt-5">
        <h5 class="text-secondary">Seleccione una opción:</h5>
        <b-form-select class="btn btn-primary dropdown-toggle" type="button" v-model="selected" @change="changeHandler" :options="options"></b-form-select>
    </div>

    <div v-if="selected === 'Casos'">
        <div class="row mt-3" v-if="arrCasosPcr.length > 0">
        <div class="col">
            <h2>Historial Casos Confirmados</h2>
            <line-chart 
            :chartData="arrCasosPcr" 
            :options="chartOptions" 
            :chartColors="casosColors" 
            label="casos">
            </line-chart>
        </div>
        </div>
    </div>

    <div>
        <div class="row mt-3" v-if="arrFallecimientos.length > 0">
            <div class="col" v-if="selected !== 'Casos'">
                <h2>Historial Número de Fallecidos</h2>
                <line-chart 
                :chartData="arrFallecimientos" 
                :options="chartOptions" 
                :chartColors="fallecidosColors" 
                label="fallecimientos">
                </line-chart>
            </div>
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
            selected: 'Casos',
            options: [
                { value: "Casos", text: 'Casos Confirmados'},
                { value: "Muertes", text: 'Fallecimientos' },
            ],
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

        // última fecha eliminada (undefined)
        output.pop()

        Object.values(output).forEach(d => {

            var date = moment(d.fecha, "YYYY-MM-DD").format("MM/DD/YYYY");

            var {
                casos_pcr,
                fallecimientos,
            } = d;

            this.arrCasosPcr.unshift({total: casos_pcr, date});
            this.arrFallecimientos.unshift({date, total: fallecimientos});

        })
       
        //this.arrCasosPcr.shift()   
    },
    methods: {
    }
}
</script>

<style>
#mycontent-left {
  border-right: 1px solid #e4e4e4;
}
</style>