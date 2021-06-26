<template>
<div>
    <main class="mb-3" v-if="!loading">
        <div class="row">
        <div class="col text-center mt-4 mb-4">
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
                            <h4 class="card-title">{{arrPersonaCom[0].total}} ({{porcentaje}}%)</h4>
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
                <h4>Vacunación por Comunidad Autónoma</h4>
                <bar-chart
                :vacunasAdmin="dataChart"
                :pautaComp="dataChart2"
                >
                </bar-chart>
            </div>
        </div>

        <hr class="my-4 mt-5">

        <div class="row mt-5 mb-3" v-if="arrDosis.length > 0">
            <div class="col">
                <h4 class="text-center mb-3">Dosis Entregadas</h4>
                <vaccine-chart
                :chartData="dataDou" 
                :options="chartOptions" 
                :chartColors="douColors" 
                >
                </vaccine-chart>
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
import VaccineChart from './VaccineChart';

export default {
    components: {
        BarChart,
        VaccineChart
    },
    data() {
        return {
            loading: true,
            dataChart: [],
            dataChart2: [],
            dataDou: [],
            porcentaje: [],
            douColors: {
                borderColor: "#FFFFFF",
                backgroundColor: ["#4ecdc4", "#90be6d", "#ff6b6b", "#f9c74f"] 
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
            arrPfizer: [],
            arrModerna: [],
            arrAstraZeneca: [],
            arrJanssen: [],
            entregasTotales: [],
            chartOptions: {
                /*
                legend: {
                    position: 'bottom'
                }, */
                responsive: true,
                maintainAspectRatio: false,
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
                //Porcentaje_sobre_entregadas,
                CCAA,
                Dosis_entregadas_Pfizer,
                Dosis_entregadas_Moderna,
                Dosis_entregadas_AstraZeneca,
                Dosis_entregadas_Janssen,
            } = v;


            this.comunidades.unshift({comunidad: CCAA});
            this.arrDosis.unshift({total: Dosis_administradas, dateVacuna, CCAA});
            this.arrPersonaUna.unshift({total: Porcentaje_con_pauta_completa, dateVacuna});
            this.arrPersonaCom.unshift({total: Fecha_de_la_última_vacuna_registrada, dateVacuna});

            this.arrPfizer.unshift({total: Dosis_entregadas_Pfizer});
            this.arrModerna.unshift({total: Dosis_entregadas_Moderna});
            this.arrAstraZeneca.unshift({total: Dosis_entregadas_AstraZeneca});
            this.arrJanssen.unshift({total: Dosis_entregadas_Janssen});
        })

        // 0 = España, 2 = Melilla, 3 = Ceuta, 4 = PV, 5 = Navarra, 6 = Murcia
        // 7 = Madrid, 8 = La Rioja, 9 = Galicia, 10 = Extremadura, 11 = Valencia
        // 12 = Cataluña, 13 = Castilla La Mancha, 14 = Catilla Leon, 15 = Cantabria
        // 16 = Canarias, 17 = Baleares, 18 = Asturias, 19 = Aragón, 20 = Andalucia

        // Bucle para agregar las ultimas dosis de cada comunidad en un array
        for (let i = 2; i < 21; i++) {
            this.dataChart.push(this.arrDosis[i].total.replace('.',""));
            this.dataChart2.push(this.arrPersonaCom[i].total.replace('.',""));

        }

        // Bucle para eliminar números con más de un punto
        for (let i = 0; i < this.dataChart.length; i++) {
            if(this.dataChart[i].includes(".")){
                this.dataChart[i] = this.dataChart[i].replace(".","")
            }
        }

        for (let i = 0; i < this.dataChart2.length; i++) {
            if(this.dataChart2[i].includes(".")){
                this.dataChart2[i] = this.dataChart2[i].replace(".","")
            }
        }

        // Invertimos el Array para tener orden alfabético
        this.dataChart.reverse() 
        this.dataChart2.reverse() 



        // Obtenemos el porcentaje de gente con pauta completa
        let total = this.arrPersonaCom[0].total

        total = total.replace('.','')
        this.porcentaje = Number(total.replace('.',''))

        this.porcentaje = ((this.porcentaje*100)/47329981).toFixed(1);


        // Asignamos los tipos de vacunas al grafico de doughnut
        this.dataDou.unshift(this.arrPfizer[0].total, this.arrModerna[0].total, this.arrAstraZeneca[0].total, this.arrJanssen[0].total)

        for (let i = 0; i < this.dataDou.length; i++) {
            if(this.dataDou[i].includes(".")){
                this.dataDou[i] = this.dataDou[i].replace(".","")
                this.dataDou[i] = this.dataDou[i].replace(".","")
            }
        }

    },
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