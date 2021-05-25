import Vue from 'vue'
import { BootstrapVue} from 'bootstrap-vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'
import Routes from './routes'

Vue.use(VueRouter);
Vue.use(BootstrapVue)


const router = new VueRouter({
  routes: Routes,
  mode: 'history',

  // Volver a la parte superior al cambiar de ruta
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
