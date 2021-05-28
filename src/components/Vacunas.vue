<template>
<div>
    <main v-if="!loading">
        <div class="row">
        <div class="col text-center mt-4 mb-3">
            <h1>Vacunación en España</h1>
        </div>
        </div>
        <div class="card text-center">
            <template v-if="arrDosis[0]">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="card-body" id="mycontent-left">
                            <h3 class="card-title text-primary mt-3">Dosis Administradas:</h3>
                            <h4 class="card-title">{{arrDosis[0].total}}</h4>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="card-body">
                            <h3 class="card-title text-primary mt-3">Personas con Pauta Completa:</h3>
                            <h4 class="card-title">{{arrPersonaCom[0].total}}</h4>
                        </div>
                    </div>
                </div>
                <div class="card-footer text-muted">
                    Última fecha registrada: {{arrDosis[0].dateVacuna}}
                </div>
            </template>
        </div>
        <div class="row mt-5" v-if="arrDosis.length > 0">
            <div class="col">
                <bar-chart
                >
                </bar-chart>
            </div>
        </div>
    </main>

    <main v-else class="h-100">
        <div class="row">
        <div class="col text-center mt-5 mb-3">
            <h5>Cargando Datos...</h5>
            <img :src="imagenCarga" alt="Reloj de arena">
        </div>
        </div>
    </main>

</div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';

import BarChart from './BarChart';


export default {
    components: {
        BarChart,
    },
    data() {
        return {
            loading: true,
            dataDou: [40, 30, 20, 10],
            douColors: {
                backgroundColor: ["#339AF7", "#f79d65", "#EC3D67", "#69c26a"] 
            },
            comunidades: [],
            imagenCarga: require('../assets/reloj.gif'),
            arrDosis: [],
            casosColors: {
                borderColor: "#077187",
                pointBorderColor: "#0E1428",
                pointBackgroundColor: "#AFD6AC",
                backgroundColor: "#74A57F"
            },
            arrPersonaUna: [],
            arrPersonaCom: [],
            fallecidosColors: {
                borderColor: "#251F47",
                pointBorderColor: "#260F26",
                pointBackgroundColor: "#858EAB",
                backgroundColor: "#858EAB"
            },
            chartOptions: {
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
        }
    },
    async created(){
        const datosVacunas = await axios.get('https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_vacunas.csv');
        this.loading = false
        // aconvert.com/es/document/csv-to-json/
        
        // Cambiamos los espacios con "_"
        const inputVacunas = datosVacunas.data.replace(/ /g,"_");

        // Csv a JSON
        // Vacunas 
        const linesVacunas = inputVacunas.split('\n') 
        const headerVacunas = linesVacunas[0].split(',') 
        const outputVacunas = linesVacunas.slice(1).map(line => {
            const fieldsVacunas = line.split(',') 
            return Object.fromEntries(headerVacunas.map((h, i) => [h, fieldsVacunas[i]]))
        })

        // última fecha eliminada (undefined)
        outputVacunas.pop()


        Object.values(outputVacunas).forEach(v => {

            var dateVacuna = moment(v.['Fecha_publicación'], "YYYY-MM-DD").format("MM/DD/YYYY");

            var {
                Dosis_administradas,
                // Personas con al menos una vacuna
                Porcentaje_con_pauta_completa,
                // Persona con pauta completa
                Fecha_de_la_última_vacuna_registrada,
                CCAA,
            } = v;
            

            this.comunidades.unshift({comunidad: CCAA});
            this.arrDosis.unshift({total: Dosis_administradas, dateVacuna, CCAA});
            this.arrPersonaUna.unshift({total: Porcentaje_con_pauta_completa, dateVacuna});
            this.arrPersonaCom.unshift({total: Fecha_de_la_última_vacuna_registrada, dateVacuna});
            


        })

        // 0 = España, 2 = Melilla, 3 = Ceuta, 4 = PV, 5 = Navarra, 6 = Murcia
        // 7 = Madrid, 8 = La Rioja, 9 = Galicia, 10 = Extremadura, 11 = Valencia
        // 12 = Cataluña, 13 = Castilla La Mancha, 14 = Catilla Leon, 15 = Cantabria
        // 16 = Canarias, 17 = Baleares, 18 = Asturias, 19 = Aragón, 20 = Andalucia

        
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
main{
    min-height: 700px;
}
</style>