<template>
<div>
    <main v-if="!loading">
        <div class="row">
        <div class="col text-center mt-4 mb-3">
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

        <div class="row mt-5" v-if="arrCasosPcr.length > 0">
            <div class="col">
                <doughnut-chart
                :chartData="dataDou" 
                :options="chartOptions" 
                :chartColors="hospColors" 
                >
                </doughnut-chart>
            </div>
        </div>

        <hr class="my-4 mt-5">

        <div class="dropdown mt-5">
            <p id="instruccion" class="text-muted">Seleccione una opción:</p>
            <b-form-select class="btn btn-primary dropdown-toggle" type="button" v-model="selected" :options="options"></b-form-select>
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
                <div class="col" v-if="selected == 'Muertes' ">
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

        <div>
            <div class="row" v-if="arrUci.length > 0">
                <div class="col" v-if="selected == 'Uci'">
                    <h2>Historial de Ingresos UCI</h2>
                    <line-chart 
                    :chartData="arrUci" 
                    :options="chartOptions" 
                    :chartColors="uciColors" 
                    label="Ingresos UCI">
                    </line-chart>
                </div>
            </div>
        </div>

        <div>
            <div class="row" v-if="arrHospitalizados.length > 0">
                <div class="col" v-if="selected == 'Hospitalizados'">
                    <h2>Historial de Hospitalizados</h2>
                    <line-chart 
                    :chartData="arrHospitalizados" 
                    :options="chartOptions" 
                    :chartColors="hospColors" 
                    label="Hospitalizados">
                    </line-chart>
                </div>
            </div>
        </div>
    </main>

    <main v-else class="h-100">
    </main>

</div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';

import LineChart from './LineChart';
import DoughnutChart from './DoughnutChart';

export default {
    components: {
        LineChart,
        DoughnutChart
    },
    data() {
        return {
            loading: true,
            dataDou: [],
            selected: 'Casos',
            options: [
                { value: "Casos", text: 'Casos Confirmados'},
                { value: "Muertes", text: 'Fallecimientos' },
                { value: "Uci", text: 'Ingresos Uci' },
                { value: "Hospitalizados", text: 'Hospitalizados' },
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
            arrUci: [],
            uciColors: {
                borderColor: "#013a63",
                pointBorderColor: "#014f86",
                pointBackgroundColor: "#7ba0d4",
                backgroundColor: "#507dbc"
            },
            arrHospitalizados: [],
            hospColors: {
                borderColor: "#c95e4b",
                pointBorderColor: "#c4694b",
                pointBackgroundColor: "#fed27b",
                backgroundColor: "#f79d65"
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
            }
        }
    },
    async created(){
        const datos = await axios.get('https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/nacional_covid19.csv');
        this.loading = false
        
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

            var date = moment(d.fecha, "YYYY-MM-DD").format("DD/MM/YYYY");

            var {
                casos_pcr,
                fallecimientos,
                ingresos_uci,
                hospitalizados
            } = d;

            this.arrCasosPcr.unshift({total: casos_pcr, date});
            this.arrFallecimientos.unshift({date, total: fallecimientos});
            this.arrUci.unshift({date, total: ingresos_uci});
            this.arrHospitalizados.unshift({date, total: hospitalizados});

        })

        // Eliminamos los valores de cero
        this.arrUci = this.arrUci.filter(i => i.total);
        this.arrHospitalizados = this.arrHospitalizados.filter(i => i.total);

        this.dataDou.unshift(this.arrCasosPcr[0].total, this.arrFallecimientos[0].total);

        console.log(this.dataDou)
         
    },
    methods: {
    }
}
</script>

<style>
#mycontent-left {
  border-right: 1px solid #e4e4e4;
}

main{
    min-height: 700px;
}

#instruccion{
    margin-bottom: 0;
}
</style>